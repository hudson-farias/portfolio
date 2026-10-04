"""Add show column to frameworks

Revision ID: r4s5t6u7v8w9
Revises: q3r4s5t6u7v8
Create Date: 2026-10-04 16:25:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'r4s5t6u7v8w9'
down_revision: Union[str, None] = 'q3r4s5t6u7v8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column(
        'frameworks',
        sa.Column('show', sa.Boolean(), nullable = False, server_default = 'true'),
    )


def downgrade():
    op.drop_column('frameworks', 'show')
