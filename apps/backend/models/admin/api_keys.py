from datetime import datetime
from typing import Optional

from pydantic import BaseModel, field_validator


class ApiKeyDTO(BaseModel):
    name: str

    @field_validator('name')
    @classmethod
    def valid_name(cls, value: str):
        cleaned = value.strip()
        if not cleaned or len(cleaned) > 255:
            raise ValueError('Nome inválido.')
        return cleaned


class ApiKey(BaseModel):
    id: int
    name: str
    key_prefix: str
    created_at: datetime
    last_used_at: Optional[datetime] = None
    revoked: bool


class ApiKeyCreated(ApiKey):
    key: str
