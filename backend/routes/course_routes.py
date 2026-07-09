"""
Course routes — AI recommendations + bookmarks
"""
import json
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db import db
from models.models import User, Bookmark, Progress
from services.watsonx_service import WatsonxService
from utils.helpers import safe_json_loads
from utils.resource_catalog import POPULAR_COURSES as POPULAR_COURSE_CATALOG, resolve_popular_courses

course_bp = Blueprint("courses", __name__)

# Curated fallback courses. The shared catalog is used first so the UI can
# surface the exact popular-course links provided by the user.
CURATED_COURSES = [
    {
        "id": "ibm-python-ds",
        "title": "Python for Data Science, AI & Development",
        "platform": "IBM SkillsBuild / Coursera",
        "url": "https://www.coursera.org/learn/python-for-applied-data-science-ai",
        "duration": "25 hours",
        "difficulty": "Beginner",
        "rating": 4.6,
        "free": True,
        "recommended": True,
        "description": "IBM's official Python course — free audit available.",
        "image_color": "#0F62FE",
        "category": "python",
    },
    {
        "id": "fcc-responsive-web",
        "title": "Responsive Web Design Certification",
        "platform": "freeCodeCamp",
        "url": "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
        "duration": "300 hours",
        "difficulty": "Beginner",
        "rating": 4.8,
        "free": True,
        "recommended": True,
        "description": "100% free, project-based HTML/CSS certification.",
        "image_color": "#0A0A23",
        "category": "frontend",
    },
    {
        "id": "cs50x",
        "title": "CS50: Introduction to Computer Science",
        "platform": "edX (Harvard)",
        "url": "https://www.edx.org/learn/computer-science/harvard-university-cs50-s-introduction-to-computer-science",
        "duration": "100 hours",
        "difficulty": "Beginner",
        "rating": 4.9,
        "free": True,
        "recommended": True,
        "description": "The most popular computer science course in the world. Free audit.",
        "image_color": "#A51C30",
        "category": "fundamentals",
    },
    {
        "id": "odin-fullstack",
        "title": "The Odin Project — Full Stack Path",
        "platform": "The Odin Project",
        "url": "https://www.theodinproject.com/",
        "duration": "Self-paced",
        "difficulty": "Beginner–Intermediate",
        "rating": 4.8,
        "free": True,
        "recommended": True,
        "description": "100% free, project-first full stack web development curriculum.",
        "image_color": "#D24222",
        "category": "fullstack",
    },
    {
        "id": "meta-react-native",
        "title": "Meta Front-End Developer Certificate",
        "platform": "Coursera",
        "url": "https://www.coursera.org/professional-certificates/meta-front-end-developer",
        "duration": "7 months",
        "difficulty": "Beginner",
        "rating": 4.7,
        "free": False,
        "recommended": True,
        "description": "Professional certificate by Meta. Financial aid available.",
        "image_color": "#0082FB",
        "category": "frontend",
    },
    {
        "id": "ibm-data-science",
        "title": "IBM Data Science Professional Certificate",
        "platform": "Coursera",
        "url": "https://www.coursera.org/professional-certificates/ibm-data-science",
        "duration": "11 months",
        "difficulty": "Beginner",
        "rating": 4.6,
        "free": False,
        "recommended": False,
        "description": "12-course program by IBM. Highly recognised certificate.",
        "image_color": "#054ADA",
        "category": "data-science",
    },
    {
        "id": "fcc-js-algo",
        "title": "JavaScript Algorithms and Data Structures",
        "platform": "freeCodeCamp",
        "url": "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/",
        "duration": "300 hours",
        "difficulty": "Intermediate",
        "rating": 4.7,
        "free": True,
        "recommended": True,
        "description": "Master JS fundamentals and problem solving. Completely free.",
        "image_color": "#F7DF1E",
        "category": "javascript",
    },
    {
        "id": "nptel-dbms",
        "title": "Database Management Systems",
        "platform": "NPTEL",
        "url": "https://nptel.ac.in/courses/106105175",
        "duration": "12 weeks",
        "difficulty": "Intermediate",
        "rating": 4.5,
        "free": True,
        "recommended": False,
        "description": "IIT-level DBMS course. NPTEL certification available.",
        "image_color": "#FF6600",
        "category": "database",
    },
]

def _merge_catalog_courses() -> list[dict]:
    seen = set()
    merged = []
    for course in POPULAR_COURSE_CATALOG + CURATED_COURSES:
        course_id = course.get("id") or _slugify(course.get("title", ""))
        if course_id in seen:
            continue
        seen.add(course_id)
        merged.append({**course, "id": course_id})
    return merged


CATALOG_COURSES = _merge_catalog_courses()


@course_bp.route("/courses", methods=["GET"])
@jwt_required()
def get_courses():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    category = request.args.get("category", "")
    search = request.args.get("search", "").lower()
    ai_mode = request.args.get("ai", "false").lower() == "true"

    if ai_mode and user.career_goal:
        # Prefer the shared popular-courses catalog before asking Granite.
        catalog_matches = resolve_popular_courses(user.career_goal, category=category or search, limit=8)
        if catalog_matches:
            bookmarks = {b.course_id for b in Bookmark.query.filter_by(user_id=user_id).all()}
            for c in catalog_matches:
                c["bookmarked"] = c["id"] in bookmarks
            return jsonify({"courses": catalog_matches, "source": "catalog"}), 200

        # Get topics the user has completed
        completed = [p.topic for p in Progress.query.filter_by(user_id=user_id, status="completed").all()]
        raw = WatsonxService.suggest_courses(user.career_goal, user.skill_level, completed)
        ai_courses = safe_json_loads(raw, fallback=[])
        if ai_courses:
            return jsonify({"courses": ai_courses, "source": "ai"}), 200

    # Return catalog courses filtered by category/search
    courses = CATALOG_COURSES
    if category:
        courses = [c for c in courses if c.get("category") == category]
    if search:
        courses = [c for c in courses if search in c["title"].lower() or search in c["description"].lower()]

    # Mark bookmarked
    bookmarks = {b.course_id for b in Bookmark.query.filter_by(user_id=user_id).all()}
    for c in courses:
        c["bookmarked"] = c["id"] in bookmarks

    return jsonify({"courses": courses, "source": "curated"}), 200


@course_bp.route("/courses/bookmark", methods=["POST"])
@jwt_required()
def toggle_bookmark():
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}
    course_id = data.get("course_id", "")
    course_data = data.get("course_data", {})

    existing = Bookmark.query.filter_by(user_id=user_id, course_id=course_id).first()
    if existing:
        db.session.delete(existing)
        db.session.commit()
        return jsonify({"bookmarked": False}), 200

    bm = Bookmark(user_id=user_id, course_id=course_id, course_data=json.dumps(course_data))
    db.session.add(bm)
    db.session.commit()
    return jsonify({"bookmarked": True}), 200


@course_bp.route("/courses/bookmarks", methods=["GET"])
@jwt_required()
def get_bookmarks():
    user_id = int(get_jwt_identity())
    bookmarks = Bookmark.query.filter_by(user_id=user_id).all()
    return jsonify([b.to_dict() for b in bookmarks]), 200
