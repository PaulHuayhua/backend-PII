from flask import Blueprint, request, jsonify
from app.services.permission_type_service import (
    get_all,
    get_by_id,
    create,
    update,
    delete_logical,
    restore
)

permission_type_bp = Blueprint("permission_type", __name__)

# 🔹 Listar tipos de permiso
@permission_type_bp.route("", methods=["GET"])
@permission_type_bp.route("/", methods=["GET"])
def list_permission_types():
    include_inactive = request.args.get("include_inactive", "0") == "1"
    status = request.args.get("status")
    status = status.upper() if status else None
    return jsonify(get_all(active_only=not include_inactive, status=status))

# 🔹 Obtener por ID
@permission_type_bp.route("/<int:identifier>", methods=["GET"])
def get_permission_type(identifier):
    permission_type = get_by_id(identifier)
    if not permission_type or permission_type.get("status") != "A":
        return jsonify({"error": "Tipo de Permiso no encontrado"}), 404
    return jsonify(permission_type)

# 🔹 Crear nuevo tipo de permiso
@permission_type_bp.route("", methods=["POST"])
@permission_type_bp.route("/", methods=["POST"])
def create_permission_type():
    data = request.json
    if not data:
        return jsonify({"error": "Registro Invalido"}), 400
    new_permission_type = create(data)
    return jsonify(new_permission_type), 201

# 🔹 Actualizar tipo de permiso
@permission_type_bp.route("/<int:identifier>", methods=["PUT"])
def update_permission_type(identifier):
    data = request.json
    updated = update(identifier, data)
    if not updated or updated.get("status") != "A":
        return jsonify({"error": "Tipo de Permiso no encontrado"}), 404
    return jsonify(updated)

# 🔹 Eliminado lógico
@permission_type_bp.route("/<int:identifier>", methods=["DELETE"])
def delete_permission_type(identifier):
    success = delete_logical(identifier)
    if not success:
        return jsonify({"error": "Tipo de Permiso no encontrado"}), 404
    return jsonify({"message": "Eliminado logico"}), 200

# 🔹 Restaurar registro
@permission_type_bp.route("/restore/<int:identifier>", methods=["PUT"])
def restore_permission_type(identifier):
    success = restore(identifier)
    if not success:
        return jsonify({"error": "Tipo de permiso no encontrado"}), 404
    return jsonify({"message": "Restaurado logico"}), 200
