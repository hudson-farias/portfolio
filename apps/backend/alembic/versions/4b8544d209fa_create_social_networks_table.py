"""Create social_networks table

Revision ID: 4b8544d209fa
Revises: fbcd77d5442e
Create Date: 2025-02-13 08:50:37.462362

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4b8544d209fa'
down_revision: Union[str, None] = 'fbcd77d5442e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'social_networks',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('url', sa.String(150), nullable=False),
        sa.Column('icon', sa.String(100), nullable=True),
        sa.Column('show_header', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('show_footer', sa.Boolean(), nullable=False, server_default='false')
    )


def downgrade() -> None:
    op.drop_table('social_networks')
