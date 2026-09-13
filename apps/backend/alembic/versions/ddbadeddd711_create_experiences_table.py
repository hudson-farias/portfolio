"""Create experiences table

Revision ID: ddbadeddd711
Revises: 
Create Date: 2025-02-13 08:24:55.315144

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ddbadeddd711'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'experiences',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('company', sa.String(255), nullable=False),
        sa.Column('period', sa.String(100), nullable=False),
        sa.Column('role', sa.String(150), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
    )


def downgrade() -> None:
    op.drop_table('experiences')
