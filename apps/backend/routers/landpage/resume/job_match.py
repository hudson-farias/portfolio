from html import unescape
from json import dumps, loads
from re import sub
from typing import Optional
from urllib.parse import urlparse

from fastapi import Depends, HTTPException
import httpx

from routers.landpage import router
from routers.admin import has_authenticated

from database.skills import SkillsORM
from database.frameworks import FrameworksORM
from database.languages import LanguagesORM
from database.databases import DatabasesORM
from database.tools import ToolsORM
from database.experiences import ExperiencesORM
from database.roles import RolesORM

from models.landpage.resume_ai import JobMatchRequest, JobMatchResponse, JobMatchFilters, JobMatchSuggest, MissingSkill, ExperienceRoleAssignment
from prompts import load_pair
from services.google_ai import GoogleAI


FETCH_TIMEOUT = 15.0
MAX_HTML_BYTES = 500_000
MAX_JOB_TEXT_CHARS = 12_000


def resolve_suggest_flags(params: JobMatchRequest):
    if params.suggest is not None:
        return params.suggest

    return JobMatchSuggest(
        summary = params.suggest_summary,
        header_roles = params.suggest_header_roles,
        experience_roles = params.suggest_experience_roles,
        filters = params.suggest_filters,
        missing_skills = params.suggest_missing_skills,
    )


def validate_job_url(url: str):
    parsed = urlparse((url or '').strip())
    if parsed.scheme not in ('http', 'https') or not parsed.netloc:
        raise HTTPException(status_code = 400, detail = 'URL inválida. Use http ou https.')
    return parsed.geturl()


async def fetch_job_html(url: str):
    try:
        async with httpx.AsyncClient(timeout = FETCH_TIMEOUT, follow_redirects = True) as client:
            response = await client.get(url, headers = {'User-Agent': 'portfolio-resume-job-match/1.0'})
    except httpx.HTTPError:
        raise HTTPException(status_code = 400, detail = 'Falha ao buscar a URL da vaga.')

    if response.status_code >= 400:
        raise HTTPException(status_code = 400, detail = f'URL retornou status {response.status_code}.')

    content = response.content[:MAX_HTML_BYTES]
    return content.decode(response.encoding or 'utf-8', errors = 'replace')


def html_to_text(html: str):
    text = sub(r'(?is)<(script|style|noscript)[^>]*>.*?</\1>', ' ', html)
    text = sub(r'(?is)<br\s*/?>', '\n', text)
    text = sub(r'(?is)</(p|div|li|h[1-6]|tr)>', '\n', text)
    text = sub(r'(?is)<[^>]+>', ' ', text)
    text = unescape(text)
    text = sub(r'[ \t]+', ' ', text)
    text = sub(r'\n{3,}', '\n\n', text)
    return text.strip()[:MAX_JOB_TEXT_CHARS]


async def load_catalog():
    async with SkillsORM() as orm: skills = await orm.find_many()
    async with FrameworksORM() as orm: frameworks = await orm.find_many()
    async with LanguagesORM() as orm: languages = await orm.find_many()
    async with DatabasesORM() as orm: databases = await orm.find_many()
    async with ToolsORM() as orm: tools = await orm.find_many()
    async with ExperiencesORM() as orm: experiences = await orm.find_many()
    async with RolesORM() as orm: roles = await orm.find_many()

    role_items = []
    for role in roles:
        picked = [t for t in role.translations if t.locale == 'pt']
        if not picked: picked = [t for t in role.translations if t.locale == 'en']
        translation = picked[0] if picked else None
        role_items.append({
            'id': role.id,
            'title': translation.title if translation else '',
        })

    experience_items = []
    for experience in experiences:
        if experience.exclude_from_ai:
            continue

        picked = [t for t in experience.translations if t.locale == 'pt']
        if not picked: picked = [t for t in experience.translations if t.locale == 'en']
        translation = picked[0] if picked else None

        experience_items.append({
            'id': experience.id,
            'company': experience.company,
            'role_id': experience.role_id,
            'period': translation.period if translation else '',
            'description': (translation.description if translation else '')[:400],
        })

    catalog = {
        'skills': [{'id': row.id, 'name': row.name} for row in skills],
        'frameworks': [{'id': row.id, 'name': row.name, 'scope': row.scope} for row in frameworks],
        'languages': [{'id': row.id, 'name': row.name} for row in languages],
        'databases': [{'id': row.id, 'name': row.name} for row in databases],
        'tools': [{'id': row.id, 'name': row.name} for row in tools],
        'roles': role_items,
        'experiences': experience_items,
    }

    valid_ids = {
        'skill_ids': {row.id for row in skills},
        'framework_ids': {row.id for row in frameworks},
        'language_ids': {row.id for row in languages},
        'database_ids': {row.id for row in databases},
        'tool_ids': {row.id for row in tools},
        'experience_ids': {item['id'] for item in experience_items},
        'role_ids': {item['id'] for item in role_items},
    }

    return catalog, valid_ids


def build_prompt_variables(catalog: dict, job_text: str, instructions: str = '', suggest: Optional[JobMatchSuggest] = None):
    suggest = suggest or JobMatchSuggest()

    schema_lines = ['{']
    if suggest.filters:
        schema_lines.extend([
            '  "filters": {',
            '    "skill_ids": [int],',
            '    "framework_ids": [int],',
            '    "language_ids": [int],',
            '    "database_ids": [int],',
            '    "tool_ids": [int],',
            '    "experience_ids": [int],',
            '    "include_tools": bool',
            '  },',
        ])
    if suggest.experience_roles:
        schema_lines.append('  "experience_roles": [{"experience_id": int, "role_id": int}],')
    if suggest.header_roles:
        schema_lines.append('  "role_ids": [int],')
    if suggest.missing_skills:
        schema_lines.append('  "missing_skills": [{"name": "string"}],')
    schema_lines.append('  "rationale": "string curta"')
    schema_lines.append('}')

    rules = ['use somente IDs existentes no catálogo']
    if suggest.missing_skills:
        rules.append('missing_skills só para habilidades pedidas na vaga que não estão no catálogo')
    if suggest.filters:
        rules.append('include_tools true se ferramentas forem relevantes')
    if suggest.experience_roles:
        rules.append('em experience_roles, sugira um role_id do catálogo de roles para cada experiência selecionada (ou as mais relevantes)')
    if suggest.header_roles:
        rules.append('em role_ids, sugira 1 a 3 títulos profissionais do catálogo de roles para o header do currículo (topo do PDF)')
    rules.append('seja seletivo — priorize o que a vaga realmente pede')

    omit = []
    if not suggest.filters:
        omit.append('não inclua filters (ou deixe vazio)')
    if not suggest.experience_roles:
        omit.append('não inclua experience_roles (ou [])')
    if not suggest.header_roles:
        omit.append('não inclua role_ids (ou [])')
    if not suggest.missing_skills:
        omit.append('não inclua missing_skills (ou [])')
    if omit:
        rules.append('campos desligados pelo candidato: ' + '; '.join(omit))

    instructions_section = ''
    if instructions:
        instructions_section = f'Instruções adicionais do candidato (obrigatório seguir):\n{instructions}\n\n'

    return {
        'schema': '\n'.join(schema_lines),
        'rules': '; '.join(rules),
        'instructions_section': instructions_section,
        'catalog': dumps(catalog, ensure_ascii = False),
        'job_text': job_text,
    }


def parse_ai_json(text: str):
    cleaned = (text or '').strip()
    if cleaned.startswith('```'):
        cleaned = sub(r'^```(?:json)?\s*', '', cleaned)
        cleaned = sub(r'\s*```$', '', cleaned)

    try:
        data = loads(cleaned)
    except Exception:
        raise HTTPException(status_code = 502, detail = 'Resposta da IA não é JSON válido.')

    if not isinstance(data, dict):
        raise HTTPException(status_code = 502, detail = 'Resposta da IA em formato inesperado.')

    return data


def as_int_list(raw, valid: set):
    if not isinstance(raw, list):
        return []

    result = []
    for item in raw:
        try:
            value = int(item)
        except (TypeError, ValueError):
            continue
        if value in valid and value not in result:
            result.append(value)

    return result


def as_experience_roles(raw, valid_experience_ids: set, valid_role_ids: set):
    if not isinstance(raw, list):
        return []

    result = []
    seen = set()

    for item in raw:
        if not isinstance(item, dict):
            continue

        try:
            experience_id = int(item.get('experience_id'))
            role_id = int(item.get('role_id'))
        except (TypeError, ValueError):
            continue

        if experience_id not in valid_experience_ids or role_id not in valid_role_ids:
            continue

        if experience_id in seen:
            continue

        seen.add(experience_id)
        result.append(ExperienceRoleAssignment(experience_id = experience_id, role_id = role_id))

    return result


def validate_ai_payload(data: dict, valid_ids: dict, suggest: Optional[JobMatchSuggest] = None):
    suggest = suggest or JobMatchSuggest()
    filters_raw = data.get('filters') if isinstance(data.get('filters'), dict) else {}

    if suggest.filters:
        tool_ids = as_int_list(filters_raw.get('tool_ids'), valid_ids['tool_ids'])
        include_tools = bool(filters_raw.get('include_tools')) or bool(tool_ids)
        filters = JobMatchFilters(
            skill_ids = as_int_list(filters_raw.get('skill_ids'), valid_ids['skill_ids']),
            framework_ids = as_int_list(filters_raw.get('framework_ids'), valid_ids['framework_ids']),
            language_ids = as_int_list(filters_raw.get('language_ids'), valid_ids['language_ids']),
            database_ids = as_int_list(filters_raw.get('database_ids'), valid_ids['database_ids']),
            tool_ids = tool_ids,
            experience_ids = as_int_list(filters_raw.get('experience_ids'), valid_ids['experience_ids']),
            include_tools = include_tools,
        )
    else:
        filters = JobMatchFilters()

    missing_skills = []
    if suggest.missing_skills:
        raw_missing = data.get('missing_skills')
        if isinstance(raw_missing, list):
            for item in raw_missing:
                if isinstance(item, dict):
                    name = str(item.get('name') or '').strip()
                else:
                    name = str(item or '').strip()
                if name:
                    missing_skills.append(MissingSkill(name = name))

    experience_roles = as_experience_roles(data.get('experience_roles'), valid_ids['experience_ids'], valid_ids['role_ids']) if suggest.experience_roles else []
    role_ids = as_int_list(data.get('role_ids'), valid_ids['role_ids']) if suggest.header_roles else []
    rationale = str(data.get('rationale') or '').strip()

    return JobMatchResponse(filters = filters, missing_skills = missing_skills, experience_roles = experience_roles, role_ids = role_ids, rationale = rationale)


@router.post('/resume/job-match', status_code = 200, response_model = JobMatchResponse)
async def post_job_match(params: JobMatchRequest, _: bool = Depends(has_authenticated)):
    url = validate_job_url(params.url)
    html = await fetch_job_html(url)
    job_text = html_to_text(html)

    if not job_text:
        raise HTTPException(status_code = 400, detail = 'Não foi possível extrair texto da vaga.')

    instructions = (params.instructions or '').strip()
    suggest = resolve_suggest_flags(params)
    catalog, valid_ids = await load_catalog()
    system, user = load_pair('landpage/resume/job_match', build_prompt_variables(catalog, job_text, instructions, suggest))

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

    data = parse_ai_json(ai_text)
    return validate_ai_payload(data, valid_ids, suggest)
