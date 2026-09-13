"""Add sort_order to experiences

Revision ID: q3r4s5t6u7v8
Revises: p2q3r4s5t6u7
Create Date: 2026-09-13 17:40:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'q3r4s5t6u7v8'
down_revision: Union[str, None] = 'p2q3r4s5t6u7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column(
        'experiences',
        sa.Column('sort_order', sa.Integer(), nullable = False, server_default = '0'),
    )
    op.execute('UPDATE experiences SET sort_order = id')


def downgrade():
    op.drop_column('experiences', 'sort_order')
