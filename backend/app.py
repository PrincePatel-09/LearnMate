 """
LearnMate — Flask Application Factory
"""
import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from database.db import db
from routes.auth_routes import auth_bp
from routes.chat_routes import chat_bp
from routes.roadmap_routes import roadmap_bp
from routes.course_routes import course_bp
from routes.progress_routes import progress_bp
from routes.dashboard_routes import dashboard_bp
from routes.profile_routes import profile_bp


def create_app():
    app = Flask(__name__)

    # ── Configuration ──────────────────────────────────────────────
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev-jwt-secret")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL", "sqlite:///learnmate.db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False

    # ── Extensions ─────────────────────────────────────────────────
    db.init_app(app)
    JWTManager(app)
    CORS(
        app,
        resources={r"/*": {"origins": os.getenv("FRONTEND_URL", "*")}},
        supports_credentials=True,
    )

    # ── Blueprints ─────────────────────────────────────────────────
    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(chat_bp, url_prefix="/api")
    app.register_blueprint(roadmap_bp, url_prefix="/api")
    app.register_blueprint(course_bp, url_prefix="/api")
    app.register_blueprint(progress_bp, url_prefix="/api")
    app.register_blueprint(dashboard_bp, url_prefix="/api")
    app.register_blueprint(profile_bp, url_prefix="/api")

    # ── Create tables ──────────────────────────────────────────────
    with app.app_context():
        db.create_all()

    # ── Routes ─────────────────────────────────────────────────────
    @app.route("/")
    def home():
        return {
            "status": "ok",
            "message": "LearnMate API Running"
        }, 200

    @app.route("/health")
    def health():
        return {
            "status": "ok",
            "service": "LearnMate API"
        }, 200

    return app
