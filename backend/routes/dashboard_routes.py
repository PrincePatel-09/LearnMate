"""
Dashboard route — aggregated data for the main dashboard view
"""
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import User, Roadmap, Progress, Achievement, ChatMessage
from utils.helpers import safe_json_loads

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard():
    user_id = int(get_jwt_identity())
    user    = User.query.get_or_404(user_id)

    # Active roadmap
    roadmap = Roadmap.query.filter_by(user_id=user_id, is_active=True).first()
    roadmap_data = safe_json_loads(roadmap.content, {}) if roadmap else {}

    # Progress summary
    all_progress = Progress.query.filter_by(user_id=user_id).all()
    completed_count   = sum(1 for p in all_progress if p.status == "completed")
    in_progress_count = sum(1 for p in all_progress if p.status == "in_progress")
    total_hours       = round(sum(p.hours_spent for p in all_progress), 1)

    # Last 3 AI suggestions from chat
    recent_ai = (
        ChatMessage.query
        .filter_by(user_id=user_id, role="assistant")
        .order_by(ChatMessage.created_at.desc())
        .limit(3)
        .all()
    )

    achievements = Achievement.query.filter_by(user_id=user_id).all()

    return jsonify({
        "user":             user.to_dict(),
        "roadmap":          roadmap.to_dict() if roadmap else None,
        "roadmap_phases":   roadmap_data.get("phases", [])[:2],  # first 2 phases for preview
        "progress": {
            "completed":   completed_count,
            "in_progress": in_progress_count,
            "total_hours": total_hours,
            "completion_pct": roadmap.completion_pct if roadmap else 0,
        },
        "recent_ai":        [m.to_dict() for m in recent_ai],
        "achievements":     [a.to_dict() for a in achievements[-5:]],
        "streak":           user.streak,
        "xp":               user.xp,
    }), 200
