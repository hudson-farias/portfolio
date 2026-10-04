"""Add exclude_from_ai column to experiences

Revision ID: s5t6u7v8w9x0
Revises: r4s5t6u7v8w9
Create Date: 2026-10-04 16:45:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 's5t6u7v8w9x0'
down_revision: Union[str, None] = 'r4s5t6u7v8w9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column(
        'experiences',
        sa.Column('exclude_from_ai', sa.Boolean(), nullable = False, server_default = 'false'),
    )


def downgrade():
    op.drop_column('experiences', 'exclude_from_ai')
