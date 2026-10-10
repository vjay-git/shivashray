"""Migrate price columns Float→NUMERIC and add GST/currency fields

Revision ID: 004
Revises: 003
Create Date: 2026-05-13

Changes:
- room_types: base_price, extra_adult_price, child_price  Float → NUMERIC(10,2)
- bookings: total_amount  Float → NUMERIC(12,2)
- bookings: add tax_amount NUMERIC(12,2), tax_rate NUMERIC(5,4), currency VARCHAR(3)
- bookings: add quoted_amount NUMERIC(12,2) for PR-04 price-lock
- CHECK constraints: base_price > 0, total_amount >= 0
"""
from alembic import op
import sqlalchemy as sa


revision = '004'
down_revision = '003'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ---------- room_types: Float → NUMERIC(10,2) ----------
    op.alter_column(
        'room_types', 'base_price',
        type_=sa.Numeric(10, 2),
        postgresql_using='base_price::numeric',
        existing_nullable=False,
    )
    op.alter_column(
        'room_types', 'extra_adult_price',
        type_=sa.Numeric(10, 2),
        postgresql_using='extra_adult_price::numeric',
        existing_nullable=True,
    )
    op.alter_column(
        'room_types', 'child_price',
        type_=sa.Numeric(10, 2),
        postgresql_using='child_price::numeric',
        existing_nullable=True,
    )
    op.create_check_constraint(
        'ck_room_types_base_price_positive',
        'room_types',
        'base_price > 0',
    )

    # ---------- bookings: total_amount Float → NUMERIC(12,2) ----------
    op.alter_column(
        'bookings', 'total_amount',
        type_=sa.Numeric(12, 2),
        postgresql_using='total_amount::numeric',
        existing_nullable=False,
    )
    op.create_check_constraint(
        'ck_bookings_total_amount_non_negative',
        'bookings',
        'total_amount >= 0',
    )

    # ---------- bookings: new GST & currency columns ----------
    op.add_column('bookings', sa.Column('tax_amount', sa.Numeric(12, 2), nullable=False, server_default='0'))
    op.add_column('bookings', sa.Column('tax_rate',   sa.Numeric(5, 4),  nullable=False, server_default='0'))
    op.add_column('bookings', sa.Column('currency',   sa.String(3),      nullable=False, server_default='INR'))
    # quoted_amount is nullable — only set when client sends it (PR-04)
    op.add_column('bookings', sa.Column('quoted_amount', sa.Numeric(12, 2), nullable=True))


def downgrade() -> None:
    op.drop_column('bookings', 'quoted_amount')
    op.drop_column('bookings', 'currency')
    op.drop_column('bookings', 'tax_rate')
    op.drop_column('bookings', 'tax_amount')

    op.drop_constraint('ck_bookings_total_amount_non_negative', 'bookings', type_='check')
    op.alter_column(
        'bookings', 'total_amount',
        type_=sa.Float(),
        postgresql_using='total_amount::double precision',
        existing_nullable=False,
    )

    op.drop_constraint('ck_room_types_base_price_positive', 'room_types', type_='check')
    op.alter_column(
        'room_types', 'child_price',
        type_=sa.Float(),
        postgresql_using='child_price::double precision',
        existing_nullable=True,
    )
    op.alter_column(
        'room_types', 'extra_adult_price',
        type_=sa.Float(),
        postgresql_using='extra_adult_price::double precision',
        existing_nullable=True,
    )
    op.alter_column(
        'room_types', 'base_price',
        type_=sa.Float(),
        postgresql_using='base_price::double precision',
        existing_nullable=False,
    )
