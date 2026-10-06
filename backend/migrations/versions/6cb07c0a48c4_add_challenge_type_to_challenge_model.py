"""Add challenge_type to Challenge model

Revision ID: 6cb07c0a48c4
Revises: d2b8e15a9f3c
Create Date: 2026-10-03 10:31:08.577278

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '6cb07c0a48c4'
down_revision: Union[str, None] = 'd2b8e15a9f3c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('challenges', sa.Column('challenge_type', sa.String(length=50), server_default='CHALLENGE', nullable=True))

def downgrade() -> None:
    op.drop_column('challenges', 'challenge_type')
