"""Initial migration

Revision ID: 001_initial
Revises: 
Create Date: 2024-01-01

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001_initial'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('full_name', sa.String(), nullable=False),
        sa.Column('phone', sa.String(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('role', sa.Enum('GUEST', 'ADMIN', name='userrole'), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)

    # Create room_types table
    op.create_table(
        'room_types',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('max_occupancy', sa.Integer(), nullable=False),
        sa.Column('base_price', sa.Float(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )

    # Create room_amenities table
    op.create_table(
        'room_amenities',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('icon', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )

    # Create rooms table
    op.create_table(
        'rooms',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('room_number', sa.String(), nullable=False),
        sa.Column('room_type_id', sa.Integer(), nullable=False),
        sa.Column('floor', sa.Integer(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('image_urls', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['room_type_id'], ['room_types.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('room_number')
    )
    op.create_index(op.f('ix_rooms_id'), 'rooms', ['id'], unique=False)
    op.create_index(op.f('ix_rooms_room_number'), 'rooms', ['room_number'], unique=True)

    # Create room_amenities association table (many-to-many)
    op.create_table(
        'room_amenity_association',
        sa.Column('room_id', sa.Integer(), nullable=True),
        sa.Column('amenity_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['amenity_id'], ['room_amenities.id'], ),
        sa.ForeignKeyConstraint(['room_id'], ['rooms.id'], )
    )

    # Create bookings table
    op.create_table(
        'bookings',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('room_id', sa.Integer(), nullable=False),
        sa.Column('check_in_date', sa.DateTime(timezone=True), nullable=False),
        sa.Column('check_out_date', sa.DateTime(timezone=True), nullable=False),
        sa.Column('number_of_guests', sa.Integer(), nullable=False),
        sa.Column('total_amount', sa.Float(), nullable=False),
        sa.Column('status', sa.Enum('PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', name='bookingstatus'), nullable=True),
        sa.Column('payment_status', sa.Enum('PENDING', 'PAID', 'REFUNDED', name='paymentstatus'), nullable=True),
        sa.Column('guest_name', sa.String(), nullable=False),
        sa.Column('guest_email', sa.String(), nullable=False),
        sa.Column('guest_phone', sa.String(), nullable=True),
        sa.Column('special_requests', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['room_id'], ['rooms.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_bookings_check_in_date'), 'bookings', ['check_in_date'], unique=False)
    op.create_index(op.f('ix_bookings_check_out_date'), 'bookings', ['check_out_date'], unique=False)
    op.create_index(op.f('ix_bookings_id'), 'bookings', ['id'], unique=False)
    op.create_index(op.f('ix_bookings_status'), 'bookings', ['status'], unique=False)

    # Create services table
    op.create_table(
        'services',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('icon', sa.String(), nullable=True),
        sa.Column('image_url', sa.String(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_services_id'), 'services', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_services_id'), table_name='services')
    op.drop_table('services')
    op.drop_index(op.f('ix_bookings_status'), table_name='bookings')
    op.drop_index(op.f('ix_bookings_id'), table_name='bookings')
    op.drop_index(op.f('ix_bookings_check_out_date'), table_name='bookings')
    op.drop_index(op.f('ix_bookings_check_in_date'), table_name='bookings')
    op.drop_table('bookings')
    op.drop_table('room_amenity_association')
    op.drop_table('room_amenities')
    op.drop_index(op.f('ix_rooms_room_number'), table_name='rooms')
    op.drop_index(op.f('ix_rooms_id'), table_name='rooms')
    op.drop_table('rooms')
    op.drop_table('room_amenities')
    op.drop_table('room_types')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
    sa.Enum(name='paymentstatus').drop(op.get_bind(), checkfirst=False)
    sa.Enum(name='bookingstatus').drop(op.get_bind(), checkfirst=False)
    sa.Enum(name='userrole').drop(op.get_bind(), checkfirst=False)

