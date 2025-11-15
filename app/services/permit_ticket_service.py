from app import db
from app.models.permit_ticket import PermitTicket
from datetime import datetime, time


# ============================================================
# Helpers
# ============================================================

def parse_date(value):
    """
    Convierte un valor en un objeto date.
    Acepta datetime.date, datetime.datetime o string 'YYYY-MM-DD'.
    """
    if not value:
        return None
    if isinstance(value, datetime):
        return value.date()
    return datetime.strptime(value, "%Y-%m-%d").date()


def parse_time_str(value):
    """
    Convierte un string o time en datetime.
    Acepta:
        - "HH:MM"
        - "HH:MM:SS"
        - "YYYY-MM-DD HH:MM:SS"
        - datetime o time
    """
    if not value:
        return None

    if isinstance(value, datetime):
        return value

    if isinstance(value, time):
        return datetime.combine(datetime.today().date(), value)

    if isinstance(value, str):
        value = value.strip()
        for fmt in ("%H:%M", "%H:%M:%S", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%d %H:%M:%S"):
            try:
                return datetime.strptime(value, fmt)
            except ValueError:
                continue

    raise ValueError("Invalid time format. Use HH:MM, HH:MM:SS, or YYYY-MM-DDTHH:MM:SS")


# ============================================================
# CRUD
# ============================================================

def get_all():
    return [t.to_dict() for t in PermitTicket.query.all()]


def get_by_id(identifier):
    ticket = PermitTicket.query.get(identifier)
    return ticket.to_dict() if ticket else None


def create(data):
    # Parsear fechas y horas
    data["application_date"] = parse_date(data.get("application_date"))
    data["start_time"] = parse_time_str(data.get("start_time"))
    data["end_time"] = parse_time_str(data.get("end_time"))

    # Asignar created_at si no viene
    data["created_at"] = parse_time_str(data.get("created_at")) or datetime.now()

    ticket = PermitTicket(**data)
    db.session.add(ticket)
    db.session.commit()
    return ticket.to_dict()


def update(identifier, data):
    ticket = PermitTicket.query.get(identifier)
    if not ticket:
        return None

    # Parsear fechas y horas si vienen en el update
    if "application_date" in data:
        data["application_date"] = parse_date(data["application_date"])

    if "start_time" in data:
        data["start_time"] = parse_time_str(data["start_time"])

    if "end_time" in data:
        data["end_time"] = parse_time_str(data["end_time"])

    if "created_at" in data:
        data["created_at"] = parse_time_str(data["created_at"])

    for key, val in data.items():
        setattr(ticket, key, val)

    db.session.commit()
    return ticket.to_dict()


def delete(identifier):
    ticket = PermitTicket.query.get(identifier)
    if not ticket:
        return False
    db.session.delete(ticket)
    db.session.commit()
    return True
