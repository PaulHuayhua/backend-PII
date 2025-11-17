from flask import Blueprint, request, jsonify
from app.services.worker_service import get_all, get_by_id, create, update, delete, restore

worker_bp = Blueprint("worker", __name__, url_prefix="/workers")

@worker_bp.route("/", methods=["GET"], strict_slashes=False)
def list_workers():
    return jsonify(get_all())

@worker_bp.route("/<int:identifier>", methods=["GET"], strict_slashes=False)
def get_worker(identifier):
    worker = get_by_id(identifier)
    if not worker:
        return jsonify({"error": "Worker not found"}), 404
    return jsonify(worker)

@worker_bp.route("/", methods=["POST"], strict_slashes=False)
def create_worker():
    data = request.json
    worker = create(data)
    return jsonify(worker), 201

@worker_bp.route("/<int:identifier>", methods=["PUT"], strict_slashes=False)
def update_worker(identifier):
    data = request.json
    worker = update(identifier, data)
    if not worker:
        return jsonify({"error": "Worker not found"}), 404
    return jsonify(worker)

@worker_bp.route("/delete/<int:identifier>", methods=["PATCH"], strict_slashes=False)
def delete_worker(identifier):
    worker = delete(identifier)
    if not worker:
        return jsonify({"error": "Worker not found"}), 404
    return jsonify(worker), 200

@worker_bp.route("/restore/<int:identifier>", methods=["PATCH"], strict_slashes=False)
def restore_worker(identifier):
    worker = restore(identifier)
    if not worker:
        return jsonify({"error": "Worker not found"}), 404
    return jsonify(worker), 200
