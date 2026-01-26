"""Add pricing fields for room types and booking

Revision ID: 002
Revises: 001
Create Date: 2025-01-XX

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add pricing fields to room_types table
    op.add_column('room_types', sa.Column('extra_adult_price', sa.Float(), nullable=True))
    op.add_column('room_types', sa.Column('child_price', sa.Float(), nullable=True))
    
    # Add adult/children count fields to bookings table
    op.add_column('bookings', sa.Column('number_of_adults', sa.Integer(), nullable=True))
    op.add_column('bookings', sa.Column('number_of_children', sa.Integer(), nullable=True))


def downgrade() -> None:
    # Remove columns from bookings table
    op.drop_column('bookings', 'number_of_children')
    op.drop_column('bookings', 'number_of_adults')
    
    # Remove columns from room_types table
    op.drop_column('room_types', 'child_price')
    op.drop_column('room_types', 'extra_adult_price')
