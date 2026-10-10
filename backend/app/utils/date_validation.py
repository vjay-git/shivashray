from datetime import datetime, timezone
from fastapi import HTTPException

MAX_BOOKING_WINDOW_DAYS = 365


def to_utc(dt: datetime) -> datetime:
    """Normalize any datetime to UTC. Treats naive datetimes as UTC."""
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def validate_date_range(check_in: datetime, check_out: datetime) -> None:
    """
    Validate check-in / check-out dates for all booking and search endpoints.
    Raises HTTPException on any violation so callers stay clean.
    """
    check_in_utc = to_utc(check_in)
    check_out_utc = to_utc(check_out)
    now_utc = datetime.now(timezone.utc)

    if check_out_utc <= check_in_utc:
        raise HTTPException(
            status_code=400,
            detail="Check-out date must be after check-in date",
        )

    # Calendar-night count — date components only, no time
    nights = (check_out_utc.date() - check_in_utc.date()).days
    if nights < 1:
        raise HTTPException(
            status_code=400,
            detail="Minimum stay is 1 night",
        )

    # Past check-in: compare date-only to avoid midnight-always-in-past bug
    if check_in_utc.date() < now_utc.date():
        raise HTTPException(
            status_code=400,
            detail="Check-in date cannot be in the past",
        )

    days_from_now = (check_in_utc.date() - now_utc.date()).days
    if days_from_now > MAX_BOOKING_WINDOW_DAYS:
        raise HTTPException(
            status_code=400,
            detail=f"Bookings cannot be made more than {MAX_BOOKING_WINDOW_DAYS} days in advance",
        )
