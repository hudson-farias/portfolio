from typing import Optional

from fastapi import Depends, HTTPException

from routers.landpage import router
from routers.admin import has_authenticated

from database.experiences import ExperiencesORM
from database.roles import RolesORM
from database.profile import ProfileORM
from database.profile_translations import ProfileTranslationsORM

from models.landpage.resume_ai import ResumeSaveRequest, ResumeSaveResponse, ExperienceRoleAssignment


def normalize_locale(locale: str):
    value = (locale or 'pt').strip().lower()
    if value.startswith('en'):
        return 'en'
    return 'pt'


async def save_about_me(profile_id: int, locale: str, about_me: str):
    filters = {'profile_id': profile_id, 'locale': locale}

    async with ProfileTranslationsORM() as orm:
        existing = await orm.find_one(**filters)
        if existing:
            await orm.update(id = existing.id, about_me = about_me)
        else:
            await orm.create(**filters, about_me = about_me, summary = '', location = '')


async def save_summary(locale: str, summary: Optional[str]):
    text = (summary or '').strip()
    if not text:
        raise HTTPException(status_code = 400, detail = 'summary é obrigatório para type=summary.')

    async with ProfileORM() as orm:
        profile = await orm.find_one()
        if not profile:
            raise HTTPException(status_code = 404, detail = 'Perfil não encontrado.')
        await save_about_me(profile.id, locale, text)

    return ResumeSaveResponse(type = 'summary', summary = text)


async def save_experience_role(experience_id: Optional[int], role_id: Optional[int]):
    if experience_id is None or role_id is None:
        raise HTTPException(status_code = 400, detail = 'experience_id e role_id são obrigatórios para type=experience_role.')

    async with ExperiencesORM() as orm: experiences = await orm.find_many()
    async with RolesORM() as orm: roles = await orm.find_many()

    valid_experience_ids = {row.id for row in experiences}
    valid_role_ids = {row.id for row in roles}

    if experience_id not in valid_experience_ids or role_id not in valid_role_ids:
        raise HTTPException(status_code = 400, detail = 'experience_id ou role_id inválido.')

    async with ExperiencesORM() as orm:
        await orm.update(id = experience_id, role_id = role_id)

    assignment = ExperienceRoleAssignment(experience_id = experience_id, role_id = role_id)
    return ResumeSaveResponse(type = 'experience_role', experience_role = assignment)


async def save_header_roles(role_ids: Optional[list]):
    """
    Persiste títulos do header habilitando show nos roles enviados.

    Preferência segura: só seta show=True (e active=True) nos IDs salvos.
    Não desliga em massa os demais roles — o usuário desativa no admin se quiser.
    """
    ids = []
    seen = set()
    for raw in role_ids or []:
        try:
            value = int(raw)
        except (TypeError, ValueError):
            continue
        if value in seen:
            continue
        seen.add(value)
        ids.append(value)

    if not ids:
        raise HTTPException(status_code = 400, detail = 'role_ids é obrigatório para type=header_roles.')

    async with RolesORM() as orm: roles = await orm.find_many()
    valid_role_ids = {row.id for row in roles}
    saved = [role_id for role_id in ids if role_id in valid_role_ids]

    if not saved:
        raise HTTPException(status_code = 400, detail = 'Nenhum role_id válido.')

    for role_id in saved:
        async with RolesORM() as orm:
            await orm.update(id = role_id, show = True, active = True)

    return ResumeSaveResponse(type = 'header_roles', role_ids = saved)


@router.post('/resume/save', status_code = 200, response_model = ResumeSaveResponse)
async def post_resume_save(params: ResumeSaveRequest, _: bool = Depends(has_authenticated)):
    locale = normalize_locale(params.locale)

    if params.type == 'summary':
        return await save_summary(locale, params.summary)

    if params.type == 'experience_role':
        return await save_experience_role(params.experience_id, params.role_id)

    if params.type == 'header_roles':
        return await save_header_roles(params.role_ids)

    raise HTTPException(status_code = 400, detail = 'type inválido.')
