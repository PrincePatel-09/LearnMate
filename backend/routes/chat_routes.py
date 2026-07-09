"""
Chat routes — Agentic conversation with IBM Granite
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db import db
from models.models import User, ChatMessage
from utils.helpers import update_streak
from utils.resource_catalog import build_resource_reply

chat_bp = Blueprint("chat", __name__)


def build_support_reply(user_message: str) -> str:
    """Return a deterministic coaching reply without calling external AI."""
    message = user_message.lower().strip()

    if "interview" in message:
        return (
            "Prepare for interviews in 4 steps:\n\n"
            "1. Revise DSA basics and solve 1-2 problems daily.\n"
            "2. Review system design fundamentals for your target role.\n"
            "3. Practice mock interviews out loud and track weak areas.\n"
            "4. Build 2-3 strong projects and be ready to explain tradeoffs.\n\n"
            "If you want, I can also give you a role-specific interview checklist."
        )

    if "roadmap" in message or "path" in message or "career" in message:
        return (
            "I can help with that. Use the Roadmap page to generate a direct roadmap.sh path for your goal, "
            "then follow it phase by phase and mark topics complete as you learn."
        )

    if any(term in message for term in ["python", "react", "frontend", "backend", "full stack", "devops", "data science", "machine learning"]):
        return (
            "Start with the fundamentals, then move to one small project, and finally revise with the official roadmap. "
            "If you want course links, ask me for the specific topic and I will list them directly."
        )

    return (
        "I can help you plan what to learn next, suggest courses, and break goals into steps. "
        "Try asking for a roadmap, interview prep, or free courses for a specific topic."
    )

SUGGESTED_QUESTIONS = [
    "What should I learn first as a beginner?",
    "Create a 3-month roadmap for me",
    "What projects should I build to get hired?",
    "How do I prepare for technical interviews?",
    "Recommend free courses for Python",
    "What skills does a Full Stack Developer need?",
    "How many hours should I study per day?",
    "What certifications are worth it in 2025?",
]


@chat_bp.route("/chat", methods=["POST"])
@jwt_required()
def chat():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    data = request.get_json(silent=True) or {}
    user_message = data.get("message", "").strip()

    if not user_message:
        return jsonify({"error": "message is required"}), 400

    direct_reply = build_resource_reply(user_message)
    if direct_reply:
        user_msg = ChatMessage(user_id=user_id, role="user", content=user_message)
        ai_msg = ChatMessage(user_id=user_id, role="assistant", content=direct_reply)
        db.session.add(user_msg)
        db.session.add(ai_msg)
        update_streak(user)
        db.session.commit()
        return jsonify({"reply": direct_reply, "message_id": ai_msg.id}), 200

    ai_response = build_support_reply(user_message)

    user_msg = ChatMessage(user_id=user_id, role="user", content=user_message)
    ai_msg = ChatMessage(user_id=user_id, role="assistant", content=ai_response)
    db.session.add(user_msg)
    db.session.add(ai_msg)

    # Update streak
    update_streak(user)
    db.session.commit()

    return jsonify({
        "reply": ai_response,
        "message_id": ai_msg.id,
    }), 200


@chat_bp.route("/chat/history", methods=["GET"])
@jwt_required()
def chat_history():
    user_id = int(get_jwt_identity())
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 50, type=int)

    messages = (
        ChatMessage.query
        .filter_by(user_id=user_id)
        .order_by(ChatMessage.created_at.asc())
        .paginate(page=page, per_page=per_page, error_out=False)
    )
    return jsonify({
        "messages": [m.to_dict() for m in messages.items],
        "total": messages.total,
        "page": page,
    }), 200


@chat_bp.route("/chat/clear", methods=["DELETE"])
@jwt_required()
def clear_chat():
    user_id = int(get_jwt_identity())
    ChatMessage.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    return jsonify({"message": "Chat history cleared"}), 200


@chat_bp.route("/chat/suggested", methods=["GET"])
def suggested_questions():
    return jsonify({"questions": SUGGESTED_QUESTIONS}), 200
