"""
Roadmap routes — Generate, fetch, update roadmaps
"""
import json
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db import db
from models.models import User, Roadmap
from utils.helpers import safe_json_loads, award_achievement
from utils.resource_catalog import resolve_roadmap

roadmap_bp = Blueprint("roadmap", __name__)


def build_local_roadmap(goal: str, skill_level: str, weekly_hours: float, interests: str) -> dict:
    """Build a simple deterministic roadmap payload without AI generation."""
    roadmap_match = resolve_roadmap(goal)
    title = roadmap_match.get("title") or goal or "Learning Roadmap"
    roadmap_url = roadmap_match.get("url", "")

    phases = [
        {
            "phase": 1,
            "title": "Understand the fundamentals",
            "duration_weeks": 2,
            "milestone": f"Build a clear base in {title.lower() if title else 'the topic'}",
            "topics": [
                {
                    "name": "Core concepts",
                    "description": f"Learn the basic concepts and terminology for {title}.",
                    "level": "Beginner" if skill_level.lower() == "beginner" else "Intermediate",
                    "estimated_hours": max(8, int(weekly_hours)),
                    "resources": ([{"title": "roadmap.sh guide", "platform": "roadmap.sh", "url": roadmap_url, "free": True}] if roadmap_url else []),
                    "status": "not_started",
                }
            ],
            "project": {
                "name": f"Starter {title} project",
                "description": f"Create a small hands-on project to apply {title} fundamentals.",
                "skills_used": [title],
            },
        },
        {
            "phase": 2,
            "title": "Practice with projects",
            "duration_weeks": 3,
            "milestone": "Apply the basics in a small project",
            "topics": [
                {
                    "name": "Project practice",
                    "description": "Reinforce the fundamentals with a mini project and notes.",
                    "level": "Beginner" if skill_level.lower() == "beginner" else "Intermediate",
                    "estimated_hours": max(10, int(weekly_hours * 1.5)),
                    "resources": ([{"title": "roadmap.sh guide", "platform": "roadmap.sh", "url": roadmap_url, "free": True}] if roadmap_url else []),
                    "status": "not_started",
                }
            ],
            "project": {
                "name": f"Build a {title.lower()} mini-project",
                "description": "Use the roadmap as a checklist and build something small and complete.",
                "skills_used": [title, "project planning"],
            },
        },
        {
            "phase": 3,
            "title": "Review and level up",
            "duration_weeks": 2,
            "milestone": "Feel ready to continue independently",
            "topics": [
                {
                    "name": "Review and refine",
                    "description": "Review what you learned, note weak spots, and continue with the official roadmap.",
                    "level": "Intermediate",
                    "estimated_hours": max(6, int(weekly_hours)),
                    "resources": ([{"title": "roadmap.sh guide", "platform": "roadmap.sh", "url": roadmap_url, "free": True}] if roadmap_url else []),
                    "status": "not_started",
                }
            ],
            "project": {
                "name": f"Refine your {title} portfolio",
                "description": "Polish one project and document what you learned.",
                "skills_used": [title, "iteration", "portfolio"],
            },
        },
    ]

    payload = {
        "title": title,
        "goal": goal,
        "skill_level": skill_level,
        "weekly_hours": weekly_hours,
        "interests": interests,
        "total_weeks": sum(phase["duration_weeks"] for phase in phases),
        "roadmapsh_url": roadmap_url,
        "roadmapsh_explanation": (
            f"Use the official roadmap.sh path for {title} as the main source of truth." if roadmap_url else ""
        ),
        "phases": phases,
    }
    return payload

def find_roadmapsh_url(goal: str) -> str:
    """Return the best-matching roadmap.sh URL for a goal, or empty string."""
    return resolve_roadmap(goal).get("url", "")


@roadmap_bp.route("/generate-roadmap", methods=["POST"])
@jwt_required()
def generate_roadmap():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    data = request.get_json(silent=True) or {}

    goal        = data.get("goal", user.career_goal or "Full Stack Developer")
    skill_level = data.get("skill_level", user.skill_level or "Beginner")
    weekly_hrs  = float(data.get("weekly_hours", user.weekly_hours or 10))
    interests   = data.get("interests", user.interests or "")

    roadmap_data = build_local_roadmap(goal, skill_level, weekly_hrs, interests)

    # Deactivate old active roadmaps
    Roadmap.query.filter_by(user_id=user_id, is_active=True).update({"is_active": False})
    db.session.commit()

    roadmap = Roadmap(
        user_id=user_id,
        title=roadmap_data.get("title", goal),
        goal=goal,
        content=json.dumps(roadmap_data),
        roadmapsh_url=roadmap_data.get("roadmapsh_url", ""),
        is_active=True,
    )
    db.session.add(roadmap)
    db.session.commit()

    award_achievement(user, "Roadmap Created", "Generated first learning roadmap", "🗺️")

    return jsonify({
        "roadmap": roadmap.to_dict(),
        "data": roadmap_data,
    }), 201


@roadmap_bp.route("/roadmap", methods=["GET"])
@jwt_required()
def get_active_roadmap():
    user_id = int(get_jwt_identity())
    roadmap = Roadmap.query.filter_by(user_id=user_id, is_active=True).first()
    if not roadmap:
        return jsonify({"roadmap": None}), 200
    return jsonify({
        "roadmap": roadmap.to_dict(),
        "data": safe_json_loads(roadmap.content, {}),
    }), 200


@roadmap_bp.route("/roadmap/all", methods=["GET"])
@jwt_required()
def get_all_roadmaps():
    user_id = int(get_jwt_identity())
    roadmaps = Roadmap.query.filter_by(user_id=user_id).order_by(Roadmap.created_at.desc()).all()
    return jsonify([r.to_dict() for r in roadmaps]), 200


@roadmap_bp.route("/roadmap/<int:roadmap_id>/progress", methods=["PUT"])
@jwt_required()
def update_roadmap_progress():
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}
    roadmap = Roadmap.query.filter_by(id=roadmap_id, user_id=user_id).first_or_404()
    roadmap.completion_pct = float(data.get("completion_pct", roadmap.completion_pct))

    # Update topic statuses inside content blob
    content = safe_json_loads(roadmap.content, {})
    topic_updates = data.get("topic_updates", {})  # {topic_name: status}
    for phase in content.get("phases", []):
        for topic in phase.get("topics", []):
            if topic["name"] in topic_updates:
                topic["status"] = topic_updates[topic["name"]]
    roadmap.content = json.dumps(content)
    db.session.commit()

    if roadmap.completion_pct >= 100:
        user = User.query.get(user_id)
        award_achievement(user, "Roadmap Complete! 🎓", "Completed a full learning roadmap", "🎓")

    return jsonify(roadmap.to_dict()), 200
