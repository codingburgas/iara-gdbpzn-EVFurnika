# -*- coding: utf-8 -*-
"""
IARA - Fisheries information system (backend).

Flask app that serves:
  - the static site from the web/ folder (HTML, CSS, JavaScript)
  - a REST API under /api/... backed by an SQLite database

Run with:
    pip install -r requirements.txt
    python app.py
Then open http://localhost:5000 in the browser.
"""
from flask import Flask, jsonify, request, send_from_directory
import os
import sys
import database as db

# Make Cyrillic console output readable on Windows
try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

WEB_DIR = os.path.join(os.path.dirname(__file__), "web")

app = Flask(__name__, static_folder=None)

# Resources exposed through the API
RESOURCES = {"korabi", "razreshitelni", "dnevnik", "inspekcii", "bileti"}


# --- Static files (the site) ---
@app.route("/")
def index():
    return send_from_directory(WEB_DIR, "index.html")


@app.route("/<path:path>")
def static_files(path):
    full = os.path.join(WEB_DIR, path)
    if os.path.isfile(full):
        return send_from_directory(WEB_DIR, path)
    # unknown path -> serve the home page
    return send_from_directory(WEB_DIR, "index.html")


# --- API ---
def _to_client(table, row):
    """Convert a DB row to the shape the frontend expects."""
    if table == "bileti" and "do_data" in row:
        row = dict(row)
        row["do"] = row.pop("do_data")
    return row


def _from_client(table, data):
    """Convert incoming frontend data to DB columns ('do' is reserved in SQL)."""
    if table == "bileti" and "do" in data:
        data = dict(data)
        data["do_data"] = data.pop("do")
    return data


@app.route("/api/<resource>", methods=["GET"])
def api_list(resource):
    if resource not in RESOURCES:
        return jsonify({"error": "Непознат ресурс"}), 404
    rows = [_to_client(resource, r) for r in db.fetch_all(resource)]
    return jsonify(rows)


@app.route("/api/<resource>", methods=["POST"])
def api_create(resource):
    if resource not in RESOURCES:
        return jsonify({"error": "Непознат ресурс"}), 404
    data = request.get_json(silent=True) or {}
    data = _from_client(resource, data)
    try:
        row = db.insert(resource, data)
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    return jsonify(_to_client(resource, row)), 201


@app.route("/api/<resource>/<int:item_id>", methods=["PUT"])
def api_update(resource, item_id):
    if resource not in RESOURCES:
        return jsonify({"error": "Непознат ресурс"}), 404
    data = _from_client(resource, request.get_json(silent=True) or {})
    try:
        row = db.update(resource, item_id, data)
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    if not row:
        return jsonify({"error": "Записът не е намерен"}), 404
    return jsonify(_to_client(resource, row))


@app.route("/api/<resource>/<int:item_id>", methods=["DELETE"])
def api_delete(resource, item_id):
    if resource not in RESOURCES:
        return jsonify({"error": "Непознат ресурс"}), 404
    db.delete(resource, item_id)
    return jsonify({"ok": True})


@app.route("/api/stats", methods=["GET"])
def api_stats():
    """Summary stats for the home page."""
    korabi = db.fetch_all("korabi")
    razreshitelni = db.fetch_all("razreshitelni")
    inspekcii = db.fetch_all("inspekcii")
    bileti = db.fetch_all("bileti")
    ulov = sum(float(d.get("kolichestvo") or 0) for d in db.fetch_all("dnevnik"))
    globi = sum(float(i.get("globa") or 0) for i in inspekcii)
    return jsonify({
        "korabi": len(korabi),
        "razreshitelni": len(razreshitelni),
        "inspekcii": len(inspekcii),
        "bileti": len(bileti),
        "ulov_kg": ulov,
        "globi_lv": globi,
    })


if __name__ == "__main__":
    db.init_db()
    print("=" * 60)
    print("  IARA - server started")
    print("  Open:  http://localhost:5000")
    print("=" * 60)
    app.run(host="0.0.0.0", port=5000, debug=True)
