"""Create projects table

Revision ID: 4eeae6d9a03b
Revises: ddbadeddd711
Create Date: 2025-02-13 08:32:46.842710

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4eeae6d9a03b'
down_revision: Union[str, None] = 'ddbadeddd711'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'projects',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('git_id', sa.Integer()),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('image_url', sa.String(150), nullable=True),
        sa.Column('live_url', sa.String(150), nullable=False),
        sa.Column('repo_url', sa.String(150), nullable=False),
    )



def downgrade() -> None:
    op.drop_table('projects')

