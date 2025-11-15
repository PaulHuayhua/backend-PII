from flask import Blueprint, request, jsonify
from app.services.worker_service import get_all, get_by_id, create, update, delete, restore

worker_bp = Blueprint("worker", __name__) 

@worker_bp.route("/", methods=["GET"])
def list_workers():
    return jsonify(get_all())

@worker_bp.route("/<int:identifier>", methods=["GET"])
def get_worker(identifier):
    worker = get_by_id(identifier)
    if not worker:
        return jsonify({"error": "Worker not found"}), 404
    return jsonify(worker)

@worker_bp.route("/save", methods=["POST"])
def create_worker():
    data = request.json
    worker = create(data)
    return jsonify(worker), 201

@worker_bp.route("/update/<int:identifier>", methods=["PUT"])
def update_worker(identifier):
    data = request.json
    worker = update(identifier, data)
    if not worker:
        return jsonify({"error": "Worker not found"}), 404
    return jsonify(worker)

@worker_bp.route("/delete/<int:identifier>", methods=["PATCH"])
def delete_worker(identifier):
    worker = delete(identifier)
    if not worker:
        return jsonify({"error": "Worker not found"}), 404
    return jsonify(worker), 200

@worker_bp.route("/restore/<int:identifier>", methods=["PATCH"])
def restore_worker(identifier):
    worker = restore(identifier)
    if not worker:
        return jsonify({"error": "Worker not found"}), 404
    return jsonify(worker), 200
