from flask import Blueprint, request, jsonify
from app.services.children_service import get_all, get_by_id, create, update, delete

children_bp = Blueprint("children", __name__)

# =======================================
# LISTAR TODOS LOS CHILDREN
# =======================================
@children_bp.route("/", methods=["GET"])
def list_children():
    return jsonify(get_all())

# =======================================
# OBTENER UN CHILD POR ID
# =======================================
@children_bp.route("/<int:identifier>", methods=["GET"])
def get_child(identifier):
    child = get_by_id(identifier)
    if not child:
        return jsonify({"error": "Child not found"}), 404
    return jsonify(child)

# =======================================
# CREAR CHILD
# =======================================
@children_bp.route("/save", methods=["POST"])
def create_child():
    data = request.json
    child = create(data)
    if "error" in child:
        return jsonify(child), 400
    return jsonify(child), 201

# =======================================
# ACTUALIZAR CHILD
# =======================================
@children_bp.route("/update/<int:identifier>", methods=["PUT"])
def update_child_route(identifier):
    data = request.json
    child = update(identifier, data)
    if not child:
        return jsonify({"error": "Child not found"}), 404
    if "error" in child:
        return jsonify(child), 400
    return jsonify(child)

# =======================================
# ELIMINAR CHILD
# =======================================
@children_bp.route("/delete/<int:identifier>", methods=["DELETE"])
def delete_child_route(identifier):
    child = delete(identifier)
    if not child:
        return jsonify({"error": "Child not found"}), 404
    if "error" in child:
        return jsonify(child), 400
    return jsonify(child), 200
