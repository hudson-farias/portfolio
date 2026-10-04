from pydantic import BaseModel
from typing import List, Literal, Optional


class JobMatchSuggest(BaseModel):
    summary: bool = True
    header_roles: bool = True
    experience_roles: bool = True
    filters: bool = True
    missing_skills: bool = True


class JobMatchRequest(BaseModel):
    url: str
    instructions: Optional[str] = None
    suggest_summary: bool = True
    suggest_header_roles: bool = True
    suggest_experience_roles: bool = True
    suggest_filters: bool = True
    suggest_missing_skills: bool = True
    suggest: Optional[JobMatchSuggest] = None


class JobMatchFilters(BaseModel):
    skill_ids: List[int] = []
    framework_ids: List[int] = []
    language_ids: List[int] = []
    database_ids: List[int] = []
    tool_ids: List[int] = []
    experience_ids: List[int] = []
    include_tools: bool = False


class ExperienceRoleAssignment(BaseModel):
    experience_id: int
    role_id: int


class MissingSkill(BaseModel):
    name: str


class JobMatchResponse(BaseModel):
    filters: JobMatchFilters
    missing_skills: List[MissingSkill] = []
    experience_roles: List[ExperienceRoleAssignment] = []
    role_ids: List[int] = []
    rationale: str = ''


class ResumeSkillCreate(BaseModel):
    name: str
    icon: str


class ResumeSkill(BaseModel):
    id: int
    name: str
    icon: str


class ResumePdfBody(BaseModel):
    sections: List[str] = []
    skill_ids: List[int] = []
    framework_ids: List[int] = []
    language_ids: List[int] = []
    database_ids: List[int] = []
    tool_ids: List[int] = []
    experience_ids: List[int] = []
    experience_roles: List[ExperienceRoleAssignment] = []
    header_role_ids: List[int] = []
    include_tools: bool = False
    include_summary: bool = True
    summary: Optional[str] = None
    portfolio_url: Optional[str] = None


class ResumeSummaryRequest(BaseModel):
    locale: str = 'pt'
    skill_ids: List[int] = []
    framework_ids: List[int] = []
    language_ids: List[int] = []
    database_ids: List[int] = []
    tool_ids: List[int] = []
    experience_ids: List[int] = []
    include_tools: bool = False
    instructions: Optional[str] = None


class ResumeSummaryResponse(BaseModel):
    summary: str


# Save granular por tipo (não é mais um blob em massa).
# - summary: persiste about_me no locale
# - experience_role: atualiza role_id de uma experiência
# - header_roles: apenas show=True nos role_ids enviados (não desliga os demais)
ResumeSaveType = Literal['summary', 'experience_role', 'header_roles']


class ResumeSaveRequest(BaseModel):
    type: ResumeSaveType
    locale: str = 'pt'
    summary: Optional[str] = None
    experience_id: Optional[int] = None
    role_id: Optional[int] = None
    role_ids: Optional[List[int]] = None


class ResumeSaveResponse(BaseModel):
    type: ResumeSaveType
    summary: Optional[str] = None
    experience_role: Optional[ExperienceRoleAssignment] = None
    role_ids: List[int] = []
