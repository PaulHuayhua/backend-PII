from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from app.settings import Config  # asegúrate que tu archivo sea settings.py

# Inicializar extensiones
db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)

    # Inicializar SQLAlchemy y Flask-Migrate
    db.init_app(app)
    migrate.init_app(app, db)

    # ==============================
    # Rutas de las tablas del sistema de boletas de permiso
    # ==============================
    from app.routes.permission_type_routes import permission_type_bp
    from app.routes.permit_ticket_routes import permit_ticket_bp
    from app.routes.worker_routes import worker_bp
    from app.routes.dependent_routes import dependent_bp
    from app.routes.children_routes import children_bp

    app.register_blueprint(permission_type_bp, url_prefix="/permission_types")
    app.register_blueprint(permit_ticket_bp, url_prefix="/permit_tickets")
    app.register_blueprint(worker_bp, url_prefix="/workers")
    app.register_blueprint(dependent_bp, url_prefix="/dependents")
    app.register_blueprint(children_bp, url_prefix="/children")

    return app
