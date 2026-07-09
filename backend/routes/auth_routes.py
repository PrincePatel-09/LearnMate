"""
Authentication routes — Register, Login, Logout, Me
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt_identity
)
from database.db import db
from models.models import User
from utils.helpers import hash_password, check_password, award_achievement

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}
    name  = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not name or not email or not password:
        return jsonify({"error": "name, email, and password are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409

    user = User(
        name=name,
        email=email,
        password_hash=hash_password(password),
        education=data.get("education", ""),
        college=data.get("college", ""),
        semester=data.get("semester", ""),
        skill_level=data.get("skill_level", "Beginner"),
        career_goal=data.get("career_goal", ""),
        interests=data.get("interests", "[]"),
        weekly_hours=float(data.get("weekly_hours", 10)),
        language=data.get("language", "English"),
    )
    db.session.add(user)
    db.session.commit()

    # First-time badge
    award_achievement(user, "Welcome!", "Joined LearnMate 🎉", "🎉")

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.to_dict()}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email    = data.get("email", "").strip().lower()
    password = data.get("password", "")

    user = User.query.filter_by(email=email).first()
    if not user or not check_password(password, user.password_hash):
        return jsonify({"error": "Invalid email or password"}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.to_dict()}), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict()), 200


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    # JWT is stateless; client simply discards the token.
    return jsonify({"message": "Logged out successfully"}), 200
