"""Add NO_SHOW booking status and booking_ref column

Revision ID: 003
Revises: 002
Create Date: 2026-05-13

"""
from alembic import op
import sqlalchemy as sa

revision = '003'
down_revision = '002'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add 'no_show' to the bookingstatus enum.
    # IF NOT EXISTS keeps this idempotent on re-runs.
    # Works whether the DB was created via alembic (native enum) or
    # via create_all (SQLAlchemy manages the type internally).
    op.execute("ALTER TYPE bookingstatus ADD VALUE IF NOT EXISTS 'no_show'")

    # Enable pgcrypto for random bytes used in booking_ref generation
    op.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto")

    # Add booking_ref — nullable first so we can back-fill existing rows
    op.add_column(
        'bookings',
        sa.Column('booking_ref', sa.String(20), nullable=True),
    )

    # Back-fill all existing bookings with a unique reference
    op.execute(
        "UPDATE bookings "
        "SET booking_ref = 'SHIV-' || upper(encode(gen_random_bytes(4), 'hex')) "
        "WHERE booking_ref IS NULL"
    )

    # Make the column required and unique
    op.alter_column('bookings', 'booking_ref', nullable=False)
    op.create_unique_constraint('uq_bookings_booking_ref', 'bookings', ['booking_ref'])
    op.create_index(op.f('ix_bookings_booking_ref'), 'bookings', ['booking_ref'], unique=True)


def downgrade() -> None:
    op.drop_index(op.f('ix_bookings_booking_ref'), table_name='bookings')
    op.drop_constraint('uq_bookings_booking_ref', 'bookings', type_='unique')
    op.drop_column('bookings', 'booking_ref')
    # PostgreSQL does not support removing enum values; no-op on downgrade
