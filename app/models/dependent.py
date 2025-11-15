from app import db
from datetime import datetime

class Dependent(db.Model):
    __tablename__ = "dependent"

    identifier = db.Column(db.Integer, primary_key=True)
    relationship_type = db.Column(db.String(100), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(120), nullable=False)
    dni = db.Column(db.String(8), nullable=False)
    birth_date = db.Column(db.Date, nullable=False)

    # Foreign Key a workers.identifier
    workers_identifier = db.Column(
        db.Integer,
        db.ForeignKey("workers.identifier"),
        nullable=False
    )

    # Relación: cada dependiente pertenece a un worker
    worker = db.relationship("Worker", backref="dependents", lazy=True)

    def to_dict(self):
        return {
            "identifier": self.identifier,
            "relationship_type": self.relationship_type,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "dni": self.dni,
            "birth_date": self.birth_date.isoformat() if self.birth_date else None,
            "workers_identifier": self.workers_identifier
        }
