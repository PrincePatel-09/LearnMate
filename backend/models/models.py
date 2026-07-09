"""
All SQLAlchemy ORM models for LearnMate.
"""
from datetime import datetime
from database.db import db


# ──────────────────────────────────────────────────────────
#  User
# ──────────────────────────────────────────────────────────
class User(db.Model):
    __tablename__ = "users"

    id              = db.Column(db.Integer, primary_key=True)
    name            = db.Column(db.String(120), nullable=False)
    email           = db.Column(db.String(200), unique=True, nullable=False)
    password_hash   = db.Column(db.String(256), nullable=False)
    avatar          = db.Column(db.String(512), default="")

    # Academic
    education       = db.Column(db.String(120), default="")
    college         = db.Column(db.String(200), default="")
    semester        = db.Column(db.String(50), default="")

    # Learning profile
    skill_level     = db.Column(db.String(50), default="Beginner")
    career_goal     = db.Column(db.String(256), default="")
    interests       = db.Column(db.Text, default="")        # JSON array stored as string
    weekly_hours    = db.Column(db.Float, default=10.0)
    language        = db.Column(db.String(50), default="English")

    # Gamification
    streak          = db.Column(db.Integer, default=0)
    xp              = db.Column(db.Integer, default=0)
    last_active     = db.Column(db.DateTime, default=datetime.utcnow)
    created_at      = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    roadmaps        = db.relationship("Roadmap",     backref="user", lazy=True, cascade="all,delete")
    chat_history    = db.relationship("ChatMessage", backref="user", lazy=True, cascade="all,delete")
    progress        = db.relationship("Progress",    backref="user", lazy=True, cascade="all,delete")
    achievements    = db.relationship("Achievement", backref="user", lazy=True, cascade="all,delete")
    bookmarks       = db.relationship("Bookmark",    backref="user", lazy=True, cascade="all,delete")

    def to_dict(self):
        return {
            "id":           self.id,
            "name":         self.name,
            "email":        self.email,
            "avatar":       self.avatar,
            "education":    self.education,
            "college":      self.college,
            "semester":     self.semester,
            "skill_level":  self.skill_level,
            "career_goal":  self.career_goal,
            "interests":    self.interests,
            "weekly_hours": self.weekly_hours,
            "language":     self.language,
            "streak":       self.streak,
            "xp":           self.xp,
            "created_at":   self.created_at.isoformat(),
        }


# ──────────────────────────────────────────────────────────
#  Roadmap
# ──────────────────────────────────────────────────────────
class Roadmap(db.Model):
    __tablename__ = "roadmaps"

    id              = db.Column(db.Integer, primary_key=True)
    user_id         = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title           = db.Column(db.String(256), nullable=False)
    goal            = db.Column(db.String(256), default="")
    content         = db.Column(db.Text, default="")   # JSON blob
    roadmapsh_url   = db.Column(db.String(512), default="")
    is_active       = db.Column(db.Boolean, default=True)
    completion_pct  = db.Column(db.Float, default=0.0)
    created_at      = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at      = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id":             self.id,
            "user_id":        self.user_id,
            "title":          self.title,
            "goal":           self.goal,
            "content":        self.content,
            "roadmapsh_url":  self.roadmapsh_url,
            "is_active":      self.is_active,
            "completion_pct": self.completion_pct,
            "created_at":     self.created_at.isoformat(),
            "updated_at":     self.updated_at.isoformat(),
        }


# ──────────────────────────────────────────────────────────
#  ChatMessage
# ──────────────────────────────────────────────────────────
class ChatMessage(db.Model):
    __tablename__ = "chat_history"

    id          = db.Column(db.Integer, primary_key=True)
    user_id     = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    role        = db.Column(db.String(20), nullable=False)   # "user" | "assistant"
    content     = db.Column(db.Text, nullable=False)
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id":         self.id,
            "role":       self.role,
            "content":    self.content,
            "created_at": self.created_at.isoformat(),
        }


# ──────────────────────────────────────────────────────────
#  Progress
# ──────────────────────────────────────────────────────────
class Progress(db.Model):
    __tablename__ = "progress"

    id              = db.Column(db.Integer, primary_key=True)
    user_id         = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    topic           = db.Column(db.String(256), nullable=False)
    status          = db.Column(db.String(50), default="not_started")  # not_started | in_progress | completed
    hours_spent     = db.Column(db.Float, default=0.0)
    completion_pct  = db.Column(db.Float, default=0.0)
    notes           = db.Column(db.Text, default="")
    updated_at      = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id":             self.id,
            "topic":          self.topic,
            "status":         self.status,
            "hours_spent":    self.hours_spent,
            "completion_pct": self.completion_pct,
            "notes":          self.notes,
            "updated_at":     self.updated_at.isoformat(),
        }


# ──────────────────────────────────────────────────────────
#  Achievement
# ──────────────────────────────────────────────────────────
class Achievement(db.Model):
    __tablename__ = "achievements"

    id          = db.Column(db.Integer, primary_key=True)
    user_id     = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    badge       = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(256), default="")
    icon        = db.Column(db.String(100), default="🏆")
    earned_at   = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id":          self.id,
            "badge":       self.badge,
            "description": self.description,
            "icon":        self.icon,
            "earned_at":   self.earned_at.isoformat(),
        }


# ──────────────────────────────────────────────────────────
#  Bookmark
# ──────────────────────────────────────────────────────────
class Bookmark(db.Model):
    __tablename__ = "bookmarks"

    id          = db.Column(db.Integer, primary_key=True)
    user_id     = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    course_id   = db.Column(db.String(100), nullable=False)
    course_data = db.Column(db.Text, default="")   # JSON blob
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        import json
        return {
            "id":          self.id,
            "course_id":   self.course_id,
            "course_data": json.loads(self.course_data) if self.course_data else {},
            "created_at":  self.created_at.isoformat(),
        }
