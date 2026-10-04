from typing import Optional

from fastapi.responses import StreamingResponse
from fastapi import Depends, HTTPException, Query

from routers.landpage import router
from routers.admin import has_authenticated, partial_authenticated

from database.skills import SkillsORM
from generators.curriculum import Curriculum
from models.landpage.resume_ai import ResumePdfBody, ResumeSkillCreate, ResumeSkill
from services.resume_filters import filters_from_resume_body, parse_resume_query


async def resume_pdf(filters: dict, is_auth: bool = False):
    curriculum = Curriculum(filters, is_auth = is_auth)
    pdf_buffer = await curriculum.generate()

    return StreamingResponse(
        pdf_buffer,
        media_type = 'application/pdf',
        headers = {'Content-Disposition': 'inline; filename="resume.pdf"'},
    )


@router.get('/resume', status_code = 200)
async def get_resume(sections: Optional[str] = Query(None), skill_ids: Optional[str] = Query(None), tool_ids: Optional[str] = Query(None), experience_ids: Optional[str] = Query(None), framework_ids: Optional[str] = Query(None), language_ids: Optional[str] = Query(None), database_ids: Optional[str] = Query(None), include_tools: bool = Query(False), include_summary: bool = Query(True), portfolio_url: Optional[str] = Query(None), summary: Optional[str] = Query(None), experience_roles: Optional[str] = Query(None), header_role_ids: Optional[str] = Query(None), is_auth: bool = Depends(partial_authenticated)):
    filters = parse_resume_query(sections, skill_ids, tool_ids, experience_ids, framework_ids, language_ids, database_ids, include_tools, include_summary, portfolio_url, summary, experience_roles, header_role_ids)
    return await resume_pdf(filters, is_auth = is_auth)


@router.post('/resume', status_code = 200)
async def post_resume(params: ResumePdfBody, _: bool = Depends(has_authenticated)):
    summary = params.summary.strip() if params.summary is not None else None
    if summary == '':
        summary = None

    filters = filters_from_resume_body(
        sections = params.sections,
        skill_ids = params.skill_ids,
        tool_ids = params.tool_ids,
        experience_ids = params.experience_ids,
        framework_ids = params.framework_ids,
        language_ids = params.language_ids,
        database_ids = params.database_ids,
        include_tools = params.include_tools,
        include_summary = params.include_summary,
        summary = summary,
        experience_roles = params.experience_roles,
        header_role_ids = params.header_role_ids,
        portfolio_url = params.portfolio_url,
    )
    return await resume_pdf(filters, is_auth = True)


@router.post('/resume/skills', status_code = 201, response_model = ResumeSkill)
async def post_resume_skill(params: ResumeSkillCreate, _: bool = Depends(has_authenticated)):
    name = params.name.strip()
    icon = params.icon.strip()

    if not name or not icon: raise HTTPException(status_code = 400, detail = 'name e icon são obrigatórios.')

    async with SkillsORM() as orm:
        await orm.create(name = name, icon = icon)
        skills = await orm.find_many()

    matches = [skill for skill in skills if skill.name == name and skill.icon == icon]
    if not matches: raise HTTPException(status_code = 500, detail = 'Skill criada, mas não foi possível recuperá-la.')

    skill = max(matches, key = lambda row: row.id)
    return ResumeSkill(id = skill.id, name = skill.name, icon = skill.icon)
