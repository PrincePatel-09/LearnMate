"""
Profile routes — GET and PUT user profile + skill assessment
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db import db
from models.models import User
from services.watsonx_service import WatsonxService
from utils.helpers import safe_json_loads

profile_bp = Blueprint("profile", __name__)


@profile_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict()), 200


@profile_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    data = request.get_json(silent=True) or {}

    updatable_fields = [
        "name", "education", "college", "semester",
        "skill_level", "career_goal", "interests",
        "weekly_hours", "language", "avatar",
    ]
    for field in updatable_fields:
        if field in data:
            setattr(user, field, data[field])

    db.session.commit()
    return jsonify(user.to_dict()), 200


@profile_bp.route("/skill-assessment", methods=["POST"])
@jwt_required()
def skill_assessment():
    """
    Accepts a list of 5 Q&A pairs and returns AI-assessed skill level.
    Payload: {"answers": [{"question": "...", "answer": "..."}]}
    """
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    data = request.get_json(silent=True) or {}
    answers = data.get("answers", [])

    if len(answers) < 3:
        return jsonify({"error": "At least 3 answers required"}), 400

    raw = WatsonxService.assess_skill(answers, user.to_dict())
    result = safe_json_loads(raw, fallback={"skill_level": "Beginner"})

    # Update user skill level automatically
    if "skill_level" in result:
        user.skill_level = result["skill_level"]
        db.session.commit()

    return jsonify(result), 200
