from app import db
from app.models.permit_ticket import PermitTicket
from datetime import datetime, time


# ============================================================
# Helpers
# ============================================================

def parse_date(value):
    """Convierte string o datetime en date."""
    if not value:
        return None
    if isinstance(value, datetime):
        return value.date()
    return datetime.strptime(value, "%Y-%m-%d").date()


def parse_time_str(value):
    """Convierte string o time en datetime."""
    if not value:
        return None

    if isinstance(value, datetime):
        return value

    if isinstance(value, time):
        return datetime.combine(datetime.today().date(), value)

    if isinstance(value, str):
        value = value.strip()

        formats = [
            "%H:%M",
            "%H:%M:%S",
            "%Y-%m-%dT%H:%M:%S",
            "%Y-%m-%d %H:%M:%S"
        ]

        for fmt in formats:
            try:
                return datetime.strptime(value, fmt)
            except ValueError:
                pass

    raise ValueError("Invalid time format")


def convert_empty_to_none(data):
    """
    Convierte strings vacíos "" a None.
    (Muy útil cuando el frontend usa FormData)
    """
    for k, v in data.items():
        if isinstance(v, str) and v.strip() == "":
            data[k] = None
    return data


def convert_numeric_fields(data):
    """Convierte campos numéricos enviados como strings."""
    numeric_fields = [
        "worker_id",
        "permission_type_id",
        "duration_hours"
    ]

    for f in numeric_fields:
        if f in data and data[f] not in (None, ""):
            try:
                data[f] = float(data[f])
            except ValueError:
                pass

    return data


def convert_boolean_fields(data):
    """Convierte '0'/'1' → False/True"""
    boolean_fields = [
        "is_half_day",
        "is_all_day"
    ]

    for f in boolean_fields:
        if f in data:
            if str(data[f]).strip() == "1":
                data[f] = True
            elif str(data[f]).strip() == "0":
                data[f] = False

    return data


# ============================================================
# CRUD
# ============================================================

def get_all(include_cancelled=False):
    """Retorna todos los tickets (filtro opcional de cancelados)."""
    query = PermitTicket.query

    if not include_cancelled:
        query = query.filter(PermitTicket.ticket_status != "Cancelado")

    return [t.to_dict() for t in query.all()]


def get_by_id(identifier):
    """Retorna un dict con los datos."""
    ticket = PermitTicket.query.get(identifier)
    return ticket.to_dict() if ticket else None


def get_model_by_id(identifier):
    """Retorna el objeto del modelo."""
    return PermitTicket.query.get(identifier)


def prepare_data(data):
    """Normaliza datos provenientes de JSON o FormData."""

    # Convertir "" → None
    data = convert_empty_to_none(data)

    # Convertir a numérico
    data = convert_numeric_fields(data)

    # Booleanos
    data = convert_boolean_fields(data)

    # Fechas y horas
    if "application_date" in data:
        data["application_date"] = parse_date(data["application_date"])

    if "start_time" in data:
        data["start_time"] = parse_time_str(data["start_time"])

    if "end_time" in data:
        data["end_time"] = parse_time_str(data["end_time"])

    return data


def create(data):
    """Crea un ticket nuevo."""
    data = prepare_data(data)

    ticket = PermitTicket(**data)
    db.session.add(ticket)
    db.session.commit()

    return ticket.to_dict()


def update(identifier, data):
    """Actualiza un ticket."""
    ticket = PermitTicket.query.get(identifier)
    if not ticket:
        return None

    data = prepare_data(data)

    for key, val in data.items():
        setattr(ticket, key, val)

    db.session.commit()
    return ticket.to_dict()


# ============================================================
# DELETE (Cancelación lógica)
# ============================================================

def delete(identifier):
    """Cancela un ticket sin borrarlo físicamente."""
    ticket = PermitTicket.query.get(identifier)
    if not ticket:
        return False

    ticket.ticket_status = "Cancelado"
    db.session.commit()
    return True


# ============================================================
# RESTORE
# ============================================================

def restore(identifier):
    """Restaura un ticket previamente cancelado."""
    ticket = PermitTicket.query.get(identifier)
    if not ticket:
        return False

    ticket.ticket_status = "Pendiente"
    db.session.commit()
    return True
