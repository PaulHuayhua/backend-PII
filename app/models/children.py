from app import db

class Children(db.Model):
    __tablename__ = "children"

    identifier = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(120), nullable=False)
    dni = db.Column(db.String(8), nullable=False)
    age = db.Column(db.Integer, nullable=False)

    # Foreign Key hacia workers.identifier
    workers_identifier = db.Column(
        db.Integer,
        db.ForeignKey("workers.identifier"),
        nullable=False
    )

    # Relación: cada hijo pertenece a un trabajador
    worker = db.relationship("Worker", backref="children", lazy=True)  # ← CORRECCIÓN

    def to_dict(self):
        return {
            "identifier": self.identifier,
            "first_name": self.first_name.strip() if self.first_name else None,
            "last_name": self.last_name.strip() if self.last_name else None,
            "dni": self.dni,
            "age": self.age,
            "workers_identifier": self.workers_identifier
        }
