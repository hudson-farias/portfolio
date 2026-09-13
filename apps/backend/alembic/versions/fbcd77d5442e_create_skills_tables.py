"""Create skills tables

Revision ID: fbcd77d5442e
Revises: 4eeae6d9a03b
Create Date: 2025-02-13 08:37:49.305428

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fbcd77d5442e'
down_revision: Union[str, None] = '4eeae6d9a03b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'skills_categories',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('title', sa.String(255), nullable=False),
    )

    op.create_table(
        'skills',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('icon', sa.String(100), nullable=True),
        sa.Column('skill_category_id', sa.Integer(), sa.ForeignKey('skills_categories.id'), nullable=False),
    )

def downgrade() -> None:
    op.drop_table('skills')
    op.drop_table('skills_categories')