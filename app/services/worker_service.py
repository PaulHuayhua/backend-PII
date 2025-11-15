from datetime import datetime
from app import db
from app.models.worker import Worker

def get_all():
    return [w.to_dict() for w in Worker.query.all()]

def get_by_id(identifier):
    worker = Worker.query.get(identifier)
    return worker.to_dict() if worker else None

def create(data):
    
    if "birth_date" in data and data["birth_date"]:
        data["birth_date"] = datetime.strptime(data["birth_date"], "%Y-%m-%d").date()
    if "work_start_date" in data and data["work_start_date"]:
        data["work_start_date"] = datetime.strptime(data["work_start_date"], "%Y-%m-%d").date()

    worker = Worker(**data)
    db.session.add(worker)
    db.session.commit()
    return worker.to_dict()

def update(identifier, data):
    worker = Worker.query.get(identifier)
    if not worker:
        return None
    
    if "birth_date" in data and data["birth_date"]:
        data["birth_date"] = datetime.strptime(data["birth_date"], "%Y-%m-%d").date()
    if "work_start_date" in data and data["work_start_date"]:
        data["work_start_date"] = datetime.strptime(data["work_start_date"], "%Y-%m-%d").date()


    for key, value in data.items():
        if hasattr(worker, key):
            setattr(worker, key, value)
    db.session.commit()
    return worker.to_dict()

def delete(identifier):
    worker = Worker.query.get(identifier)
    if not worker:
        return None

    worker.state = "I"
    db.session.commit()
    return worker.to_dict()

def restore(identifier):
    worker = Worker.query.get(identifier)
    if not worker:
        return None

    worker.state = "A"
    db.session.commit()
    return worker.to_dict()
