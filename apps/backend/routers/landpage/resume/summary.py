from json import dumps

from fastapi import Depends, HTTPException

from routers.landpage import router
from routers.admin import has_authenticated

from database.skills import SkillsORM
from database.frameworks import FrameworksORM
from database.languages import LanguagesORM
from database.databases import DatabasesORM
from database.tools import ToolsORM
from database.experiences import ExperiencesORM
from database.profile import ProfileORM

from models.landpage.resume_ai import ResumeSummaryRequest, ResumeSummaryResponse
from prompts import load_pair
from services.google_ai import GoogleAI


def normalize_locale(locale: str):
    value = (locale or 'pt').strip().lower()
    if value.startswith('en'):
        return 'en'
    return 'pt'


def pick_translation(translations, locale: str):
    picked = [t for t in translations if t.locale == locale]
    if not picked:
        picked = [t for t in translations if t.locale == 'pt']
    return picked[0] if picked else None


def filter_by_ids(rows, selected_ids: list):
    if not selected_ids:
        return rows
    selected = set(selected_ids)
    return [row for row in rows if row.id in selected]


async def build_summary_context(params: ResumeSummaryRequest, locale: str):
    async with SkillsORM() as orm: skills = await orm.find_many()
    async with FrameworksORM() as orm: frameworks = await orm.find_many()
    async with LanguagesORM() as orm: languages = await orm.find_many()
    async with DatabasesORM() as orm: databases = await orm.find_many()
    async with ToolsORM() as orm: tools = await orm.find_many()
    async with ExperiencesORM() as orm: experiences = await orm.find_many()
    async with ProfileORM() as orm: profile = await orm.find_one()

    skills = filter_by_ids(skills, params.skill_ids)
    frameworks = filter_by_ids(frameworks, params.framework_ids)
    languages = filter_by_ids(languages, params.language_ids)
    databases = filter_by_ids(databases, params.database_ids)

    if params.tool_ids or params.include_tools:
        tools = filter_by_ids(tools, params.tool_ids) if params.tool_ids else tools
    else:
        tools = []

    experiences = filter_by_ids(experiences, params.experience_ids)
    experiences = [experience for experience in experiences if not experience.exclude_from_ai]

    experience_items = []
    for experience in experiences:
        translation = pick_translation(experience.translations, locale)
        role_title = ''
        if experience.role:
            role_translation = pick_translation(experience.role.translations, locale)
            role_title = role_translation.title if role_translation else ''

        experience_items.append({
            'company': experience.company,
            'role': role_title,
            'period': translation.period if translation else '',
            'description': (translation.description if translation else '')[:500],
        })

    current_about = ''
    if profile:
        translation = pick_translation(profile.translations, locale)
        current_about = (translation.about_me if translation else '') or ''

    return {
        'locale': locale,
        'current_about': current_about[:800],
        'skills': [row.name for row in skills],
        'frameworks': [row.name for row in frameworks],
        'languages': [row.name for row in languages],
        'databases': [row.name for row in databases],
        'tools': [row.name for row in tools],
        'experiences': experience_items,
    }


def build_summary_prompt_variables(context: dict, instructions: str = ''):
    locale = context.get('locale') or 'pt'
    language_label = 'inglês' if locale == 'en' else 'português do Brasil'

    instructions_section = ''
    if instructions:
        instructions_section = f'Instruções adicionais do candidato (obrigatório seguir):\n{instructions}\n\n'

    return {
        'language_label': language_label,
        'instructions_section': instructions_section,
        'context': dumps(context, ensure_ascii = False),
    }


@router.post('/resume/summary', status_code = 200, response_model = ResumeSummaryResponse)
async def post_resume_summary(params: ResumeSummaryRequest, _: bool = Depends(has_authenticated)):
    locale = normalize_locale(params.locale)
    context = await build_summary_context(params, locale)
    instructions = (params.instructions or '').strip()
    system, user = load_pair('landpage/resume/summary', build_summary_prompt_variables(context, instructions))

    try:
        ai_text = await GoogleAI().complete(system = system, user = user)
    except RuntimeError as exc:
        detail = str(exc)
        if 'GEMINI_API_KEY' in detail:
            raise HTTPException(status_code = 503, detail = detail)
        if 'Limite de uso' in detail:
            raise HTTPException(status_code = 429, detail = detail)
        raise HTTPException(status_code = 502, detail = detail)
    except Exception:
        raise HTTPException(status_code = 502, detail = 'Falha ao consultar a IA.')

    summary = (ai_text or '').strip()
    if not summary:
        raise HTTPException(status_code = 502, detail = 'Resumo vazio retornado pela IA.')

    return ResumeSummaryResponse(summary = summary)
