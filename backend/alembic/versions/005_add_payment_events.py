"""Add payment_events audit log table

Revision ID: 005
Revises: 004
Create Date: 2026-05-13

"""
from alembic import op
import sqlalchemy as sa


revision = '005'
down_revision = '004'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'payment_events',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('booking_id', sa.Integer(), sa.ForeignKey('bookings.id'), nullable=False, index=True),
        sa.Column('event_type', sa.Enum('charged', 'refunded', name='paymenteventtype'), nullable=False),
        sa.Column('from_status', sa.String(20), nullable=True),
        sa.Column('to_status', sa.String(20), nullable=False),
        sa.Column('amount', sa.Numeric(12, 2), nullable=True),
        sa.Column('reference', sa.String(), nullable=True),
        sa.Column('actor_user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('note', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
    )


def downgrade() -> None:
    op.drop_table('payment_events')
    op.execute("DROP TYPE IF EXISTS paymenteventtype")
