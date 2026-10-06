"""add_mission_columns_to_challenges

Revision ID: d2b8e15a9f3c
Revises: c1a9f04d8e2b
Create Date: 2026-10-02 15:42:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'd2b8e15a9f3c'
down_revision: Union[str, None] = 'c1a9f04d8e2b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.add_column('challenges', sa.Column('real_world_context', sa.Text(), nullable=True))
    op.add_column('challenges', sa.Column('affected_users', sa.Text(), nullable=True))
    op.add_column('challenges', sa.Column('domain', sa.String(length=100), server_default='General', nullable=True))
    op.add_column('challenges', sa.Column('subdomain', sa.String(length=100), nullable=True))
    op.add_column('challenges', sa.Column('estimated_time', sa.String(length=50), server_default='3–5 hours', nullable=True))
    op.add_column('challenges', sa.Column('skills_required', sa.String(length=255), nullable=True))
    op.add_column('challenges', sa.Column('suggested_technologies', sa.Text(), nullable=True))
    op.add_column('challenges', sa.Column('expected_outcome', sa.Text(), nullable=True))
    op.add_column('challenges', sa.Column('impact_description', sa.Text(), nullable=True))

    # Backfill existing challenges with fallback values from category, skills, etc.
    op.execute("""
        UPDATE challenges 
        SET domain = category,
            estimated_time = estimated_hours,
            skills_required = skills,
            expected_outcome = expected_output,
            real_world_context = description,
            affected_users = 'Engineers, platform architects, and system operators'
        WHERE domain IS NULL OR domain = 'General';
    """)

def downgrade() -> None:
    op.drop_column('challenges', 'impact_description')
    op.drop_column('challenges', 'expected_outcome')
    op.drop_column('challenges', 'suggested_technologies')
    op.drop_column('challenges', 'skills_required')
    op.drop_column('challenges', 'estimated_time')
    op.drop_column('challenges', 'subdomain')
    op.drop_column('challenges', 'domain')
    op.drop_column('challenges', 'affected_users')
    op.drop_column('challenges', 'real_world_context')
