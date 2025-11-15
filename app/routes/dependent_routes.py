from flask import Blueprint, request, jsonify
from app.services.dependent_service import get_all, get_by_id, create, update, delete

dependent_bp = Blueprint("dependent", __name__)  # Nombre del blueprint

# =======================================
# LISTAR TODOS LOS DEPENDENTS
# =======================================
@dependent_bp.route("/", methods=["GET"])
def list_dependents():
    return jsonify(get_all())

# =======================================
# OBTENER UN DEPENDENT POR ID
# =======================================
@dependent_bp.route("/<int:identifier>", methods=["GET"])
def get_dependent(identifier):
    dep = get_by_id(identifier)
    if not dep:
        return jsonify({"error": "Dependent not found"}), 404
    return jsonify(dep)

# =======================================
# CREAR DEPENDENT
# =======================================
@dependent_bp.route("/save", methods=["POST"])
def create_dependent():
    data = request.json
    dep = create(data)
    if "error" in dep:
        return jsonify(dep), 400
    return jsonify(dep), 201

# =======================================
# ACTUALIZAR DEPENDENT
# =======================================
@dependent_bp.route("/update/<int:identifier>", methods=["PUT"])
def update_dependent_route(identifier):
    data = request.json
    dep = update(identifier, data)
    if not dep:
        return jsonify({"error": "Dependent not found"}), 404
    if "error" in dep:
        return jsonify(dep), 400
    return jsonify(dep)

# =======================================
# ELIMINAR DEPENDENT
# =======================================
@dependent_bp.route("/delete/<int:identifier>", methods=["DELETE"])
def delete_dependent_route(identifier):
    dep = delete(identifier)
    if not dep:
        return jsonify({"error": "Dependent not found"}), 404
    if "error" in dep:
        return jsonify(dep), 400
    return jsonify(dep), 200
