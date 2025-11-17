from datetime import datetime
from app import db
from app.models.worker import Worker

def get_all():
    return [w.to_dict() for w in Worker.query.all()]

def get_by_id(identifier):
    worker = Worker.query.get(identifier)
    return worker.to_dict() if worker else None

from datetime import datetime
from app import db
from app.models.worker import Worker

def create(data):
    # Convertir fechas
    for f in ["birth_date", "work_start_date", "onp_entry_date"]:
        if f in data and data[f]:
            data[f] = datetime.strptime(data[f], "%Y-%m-%d").date()
        else:
            data[f] = None

    if "registration_date" not in data or not data["registration_date"]:
        data["registration_date"] = datetime.now()

    worker = Worker(**data)
    db.session.add(worker)
    db.session.commit()
    return worker.to_dict()

def update(identifier, data):
    worker = Worker.query.get(identifier)
    if not worker:
        return None

    for f in ["birth_date", "work_start_date", "onp_entry_date"]:
        if f in data and data[f]:
            data[f] = datetime.strptime(data[f], "%Y-%m-%d").date()
        elif f in data:
            data[f] = None

    for key, value in data.items():
        if hasattr(worker, key):
            setattr(worker, key, value)

    db.session.commit()
    return worker.to_dict()

def delete(identifier):
    worker = Worker.query.get(identifier)
    if not worker:
        return None

    worker.status = "I"
    db.session.commit()
    return worker.to_dict()

def restore(identifier):
    worker = Worker.query.get(identifier)
    if not worker:
        return None

    worker.status = "A"
    db.session.commit()
    return worker.to_dict()
