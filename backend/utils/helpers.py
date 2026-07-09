"""
Utility helpers shared across routes.
"""
import bcrypt
import json
import re
from datetime import datetime


def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()


def check_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())


def safe_json_loads(text: str, fallback=None):
    """Try to parse JSON, return fallback on failure."""
    if fallback is None:
        fallback = {}
    try:
        # Strip markdown code fences if present
        cleaned = re.sub(r"```(?:json)?", "", text).replace("```", "").strip()
        return json.loads(cleaned)
    except Exception:
        return fallback


def award_achievement(user, badge: str, description: str, icon: str = "🏆"):
    """Award an achievement badge to a user if not already earned."""
    from models.models import Achievement
    from database.db import db
    already = Achievement.query.filter_by(user_id=user.id, badge=badge).first()
    if not already:
        ach = Achievement(user_id=user.id, badge=badge, description=description, icon=icon)
        db.session.add(ach)
        db.session.commit()
        return ach
    return None


def update_streak(user):
    """Increment streak if last active was yesterday; reset if gap > 1 day."""
    from database.db import db
    today = datetime.utcnow().date()
    last  = user.last_active.date() if user.last_active else today

    if last == today:
        pass  # already active today
    elif (today - last).days == 1:
        user.streak += 1
    else:
        user.streak = 1

    user.last_active = datetime.utcnow()
    db.session.commit()
