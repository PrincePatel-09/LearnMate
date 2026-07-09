"""
Database initialisation — SQLAlchemy instance.
Swap DATABASE_URL in .env to a Mongo URI and add PyMongo adapter for MongoDB migration.
"""
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
