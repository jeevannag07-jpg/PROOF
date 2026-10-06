"""add_reel_media_columns

Revision ID: c1a9f04d8e2b
Revises: bb1bae41f13a
Create Date: 2026-10-02 15:25:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'c1a9f04d8e2b'
down_revision: Union[str, None] = 'bb1bae41f13a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.add_column('reels', sa.Column('media_url', sa.String(length=500), nullable=True))
    op.add_column('reels', sa.Column('media_path', sa.String(length=255), nullable=True))
    op.add_column('reels', sa.Column('media_type', sa.String(length=50), server_default='CODE_ONLY', nullable=True))
    op.add_column('reels', sa.Column('thumbnail_url', sa.String(length=500), nullable=True))
    op.add_column('reels', sa.Column('aspect_ratio', sa.String(length=20), server_default='9:16', nullable=True))
    op.add_column('reels', sa.Column('duration_seconds', sa.Integer(), nullable=True))

def downgrade() -> None:
    op.drop_column('reels', 'duration_seconds')
    op.drop_column('reels', 'aspect_ratio')
    op.drop_column('reels', 'thumbnail_url')
    op.drop_column('reels', 'media_type')
    op.drop_column('reels', 'media_path')
    op.drop_column('reels', 'media_url')
