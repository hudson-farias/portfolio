from sqlalchemy import Column, Integer, String
from database import Base


class SkillsORM(Base):
    __tablename__ = 'skills'

    id = Column(Integer, primary_key = True, index = True)
    name = Column(String(255), nullable = False)
    icon = Column(String(100), nullable = False)
