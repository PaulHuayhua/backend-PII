from app import db
from app.models.dependent import Dependent
from datetime import datetime

# =======================================
# OBTENER TODOS
# =======================================
def get_all():
    dependents = Dependent.query.all()
    return [dep.to_dict() for dep in dependents]


# =======================================
# OBTENER POR ID
# =======================================
def get_by_id(identifier):
    dep = Dependent.query.get(identifier)
    return dep.to_dict() if dep else None


# =======================================
# CREAR
# =======================================
def create(data):
    try:
        dep = Dependent(
            relationship_type=data.get("relationship_type"),
            first_name=data.get("first_name"),
            last_name=data.get("last_name"),
            dni=data.get("dni"),
            birth_date=datetime.strptime(data.get("birth_date"), "%Y-%m-%d").date(),
            workers_identifier=data.get("workers_identifier"),
        )

        db.session.add(dep)
        db.session.commit()
        return dep.to_dict()

    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}


# =======================================
# ACTUALIZAR
# =======================================
def update(identifier, data):
    dep = Dependent.query.get(identifier)
    if not dep:
        return None

    try:
        dep.relationship_type = data.get("relationship_type", dep.relationship_type)
        dep.first_name = data.get("first_name", dep.first_name)
        dep.last_name = data.get("last_name", dep.last_name)
        dep.dni = data.get("dni", dep.dni)

        if data.get("birth_date"):
            dep.birth_date = datetime.strptime(data["birth_date"], "%Y-%m-%d").date()

        dep.workers_identifier = data.get("workers_identifier", dep.workers_identifier)

        db.session.commit()
        return dep.to_dict()

    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}


# =======================================
# ELIMINAR DEFINITIVO
# =======================================
def delete(identifier):
    dep = Dependent.query.get(identifier)
    if not dep:
        return None

    try:
        db.session.delete(dep)
        db.session.commit()
        return {"message": "Dependent deleted successfully"}

    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}
