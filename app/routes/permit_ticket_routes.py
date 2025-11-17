from flask import Blueprint, request, jsonify
from app import db
from app.services.permit_ticket_service import (
    get_all, get_by_id, create, update, get_model_by_id
)

permit_ticket_bp = Blueprint("permit_ticket", __name__)


# LIST ALL -----------------------------------------------------
@permit_ticket_bp.route("/", methods=["GET"])
def list_permit_tickets():
    include_cancelled = request.args.get("include_cancelled", "1") == "1"
    return jsonify(get_all(include_cancelled))


# GET BY ID ----------------------------------------------------
@permit_ticket_bp.route("/<int:identifier>", methods=["GET"])
def get_permit_ticket(identifier):
    result = get_by_id(identifier)
    if not result:
        return jsonify({"error": "PermitTicket not found"}), 404
    return jsonify(result)


# CREATE -------------------------------------------------------
@permit_ticket_bp.route("/", methods=["POST"])
def create_permit_ticket():
    # Para FormData:
    data = request.form.to_dict()
    files = request.files

    # Guardar nombres de archivos
    if "evidence_document" in files:
        data["evidence_document"] = files["evidence_document"].filename

    if "area_manager_signature" in files:
        data["area_manager_signature"] = files["area_manager_signature"].filename

    if "worker_signature" in files:
        data["worker_signature"] = files["worker_signature"].filename

    return jsonify(create(data)), 201


# UPDATE -------------------------------------------------------
@permit_ticket_bp.route("/<int:identifier>", methods=["PUT"])
def update_permit_ticket(identifier):
    # Para FormData:
    data = request.form.to_dict()
    files = request.files

    # Guardar archivos si vienen en la request
    if "evidence_document" in files:
        data["evidence_document"] = files["evidence_document"].filename

    if "area_manager_signature" in files:
        data["area_manager_signature"] = files["area_manager_signature"].filename

    if "worker_signature" in files:
        data["worker_signature"] = files["worker_signature"].filename

    updated = update(identifier, data)

    if not updated:
        return jsonify({"error": "PermitTicket not found"}), 404

    return jsonify(updated)


# CANCEL -------------------------------------------------------
@permit_ticket_bp.route("/<int:identifier>", methods=["DELETE"])
def cancel_permit_ticket(identifier):
    permit = get_model_by_id(identifier)
    if not permit:
        return jsonify({"error": "PermitTicket not found"}), 404

    permit.ticket_status = "Cancelado"
    db.session.commit()

    return jsonify({"message": "Ticket cancelado correctamente"})


# RESTORE ------------------------------------------------------
@permit_ticket_bp.route("/restore/<int:identifier>", methods=["PUT"])
def restore_permit_ticket(identifier):
    permit = get_model_by_id(identifier)
    if not permit:
        return jsonify({"error": "PermitTicket not found"}), 404

    permit.ticket_status = "Pendiente"
    db.session.commit()

    return jsonify({"message": "Ticket restaurado correctamente"})
