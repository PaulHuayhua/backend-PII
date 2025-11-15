from app import db
from app.models.children import Children

# ================================
# OBTENER TODOS LOS CHILDREN
# ================================
def get_all():
    return [c.to_dict() for c in Children.query.all()]

# ================================
# OBTENER CHILD POR ID
# ================================
def get_by_id(identifier):
    child = Children.query.get(identifier)
    return child.to_dict() if child else None

# ================================
# CREAR CHILD
# ================================
def create(data):
    try:
        child = Children(
            first_name=data["first_name"],
            last_name=data["last_name"],
            dni=data["dni"],
            age=data["age"],
            dependent_identifier=data["dependent_identifier"]
        )
        db.session.add(child)
        db.session.commit()
        return child.to_dict()
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}

# ================================
# ACTUALIZAR CHILD
# ================================
def update(identifier, data):
    child = Children.query.get(identifier)
    if not child:
        return None
    try:
        child.first_name = data.get("first_name", child.first_name)
        child.last_name = data.get("last_name", child.last_name)
        child.dni = data.get("dni", child.dni)
        child.age = data.get("age", child.age)
        child.dependent_identifier = data.get("dependent_identifier", child.dependent_identifier)
        db.session.commit()
        return child.to_dict()
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}

# ================================
# ELIMINAR CHILD
# ================================
def delete(identifier):
    child = Children.query.get(identifier)
    if not child:
        return None
    try:
        db.session.delete(child)
        db.session.commit()
        return {"message": "Child deleted successfully"}
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}
