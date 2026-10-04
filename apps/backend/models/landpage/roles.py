from pydantic import BaseModel
from typing import List, Optional


class Role(BaseModel):
    id: int
    title: str
    category: Optional[str] = None
    seniority: Optional[str] = None
    show: bool = False
    featured: bool = False
    active: bool = True
    sort_order: int = 0
    color: Optional[str] = None
    icon: Optional[str] = None


class RolesResponse(BaseModel):
    roles: List[Role] = []
