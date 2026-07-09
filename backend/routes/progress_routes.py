"""
Progress routes — Update, fetch learning progress and achievements
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db import db
from models.models import User, Progress, Achievement
from utils.helpers import award_achievement

progress_bp = Blueprint("progress", __name__)


@progress_bp.route("/update-progress", methods=["POST"])
@jwt_required()
def update_progress():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    data = request.get_json(silent=True) or {}

    topic          = data.get("topic", "").strip()
    status         = data.get("status", "in_progress")
    hours_spent    = float(data.get("hours_spent", 0))
    completion_pct = float(data.get("completion_pct", 0))
    notes          = data.get("notes", "")

    if not topic:
        return jsonify({"error": "topic is required"}), 400

    existing = Progress.query.filter_by(user_id=user_id, topic=topic).first()
    if existing:
        existing.status         = status
        existing.hours_spent    += hours_spent
        existing.completion_pct = completion_pct
        existing.notes          = notes
    else:
        existing = Progress(
            user_id=user_id,
            topic=topic,
            status=status,
            hours_spent=hours_spent,
            completion_pct=completion_pct,
            notes=notes,
        )
        db.session.add(existing)

    # Add XP
    if status == "completed":
        user.xp += 50
        award_achievement(user, f"Completed: {topic[:30]}", f"Mastered {topic}", "✅")

    db.session.commit()
    return jsonify(existing.to_dict()), 200


@progress_bp.route("/progress", methods=["GET"])
@jwt_required()
def get_progress():
    user_id = int(get_jwt_identity())
    all_progress = Progress.query.filter_by(user_id=user_id).all()
    return jsonify([p.to_dict() for p in all_progress]), 200


@progress_bp.route("/analytics", methods=["GET"])
@jwt_required()
def analytics():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    all_progress = Progress.query.filter_by(user_id=user_id).all()
    achievements = Achievement.query.filter_by(user_id=user_id).all()

    completed = [p for p in all_progress if p.status == "completed"]
    in_progress = [p for p in all_progress if p.status == "in_progress"]
    total_hours = sum(p.hours_spent for p in all_progress)

    return jsonify({
        "total_topics":     len(all_progress),
        "completed":        len(completed),
        "in_progress":      len(in_progress),
        "total_hours":      round(total_hours, 1),
        "xp":               user.xp,
        "streak":           user.streak,
        "achievements":     [a.to_dict() for a in achievements],
        "skill_distribution": {
            "completed":   len(completed),
            "in_progress": len(in_progress),
            "not_started": len(all_progress) - len(completed) - len(in_progress),
        },
        "recent_topics":  [p.to_dict() for p in sorted(all_progress, key=lambda x: x.updated_at, reverse=True)[:5]],
    }), 200
