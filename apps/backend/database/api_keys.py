from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.sql import func

from database import Base


class ApiKeysORM(Base):
    __tablename__ = 'api_keys'

    id = Column(Integer, primary_key = True, index = True)
    name = Column(String(255), nullable = False)
    key_prefix = Column(String(16), nullable = False)
    key_hash = Column(String(64), nullable = False, unique = True, index = True)
    created_at = Column(DateTime(timezone = True), nullable = False, server_default = func.now())
    last_used_at = Column(DateTime(timezone = True), nullable = True)
    revoked_at = Column(DateTime(timezone = True), nullable = True)
