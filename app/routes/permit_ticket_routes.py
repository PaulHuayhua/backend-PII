from flask import Blueprint, request, jsonify
from app.services.permit_ticket_service import (
    get_all, get_by_id, create, update, delete
)

permit_ticket_bp = Blueprint("permit_ticket", __name__)


# List all -----------------------------------------------------

@permit_ticket_bp.route("/", methods=["GET"])
def list_permit_tickets():
    return jsonify(get_all())


# Get by ID ----------------------------------------------------

@permit_ticket_bp.route("/<int:identifier>", methods=["GET"])
def get_permit_ticket(identifier):
    result = get_by_id(identifier)
    if not result:
        return jsonify({"error": "PermitTicket not found"}), 404
    return jsonify(result)


# Create -------------------------------------------------------

@permit_ticket_bp.route("/", methods=["POST"])
def create_permit_ticket():
    data = request.json
    return jsonify(create(data)), 201


# Update -------------------------------------------------------

@permit_ticket_bp.route("/<int:identifier>", methods=["PUT"])
def update_permit_ticket(identifier):
    data = request.json
    updated = update(identifier, data)
    if not updated:
        return jsonify({"error": "PermitTicket not found"}), 404
    return jsonify(updated)


# Delete -------------------------------------------------------

@permit_ticket_bp.route("/<int:identifier>", methods=["DELETE"])
def delete_permit_ticket(identifier):
    if not delete(identifier):
        return jsonify({"error": "PermitTicket not found"}), 404
    return jsonify({"message": "Deleted successfully"})
