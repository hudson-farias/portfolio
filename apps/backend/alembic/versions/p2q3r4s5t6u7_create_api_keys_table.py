"""Create api_keys table

Revision ID: p2q3r4s5t6u7
Revises: o1p2q3r4s5t6
Create Date: 2026-09-13 16:40:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'p2q3r4s5t6u7'
down_revision: Union[str, None] = 'o1p2q3r4s5t6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table(
        'api_keys',
        sa.Column('id', sa.Integer(), primary_key = True, autoincrement = True),
        sa.Column('name', sa.String(255), nullable = False),
        sa.Column('key_prefix', sa.String(16), nullable = False),
        sa.Column('key_hash', sa.String(64), nullable = False),
        sa.Column('created_at', sa.DateTime(timezone = True), nullable = False, server_default = sa.text('now()')),
        sa.Column('last_used_at', sa.DateTime(timezone = True), nullable = True),
        sa.Column('revoked_at', sa.DateTime(timezone = True), nullable = True),
    )
    op.create_index('ix_api_keys_key_hash', 'api_keys', ['key_hash'], unique = True)


def downgrade():
    op.drop_index('ix_api_keys_key_hash', table_name = 'api_keys')
    op.drop_table('api_keys')
