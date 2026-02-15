from flask import Flask, jsonify
from flask_cors import CORS
import os

from medical import medical_blueprint
from pdf import pdf_blueprint
from video import video_blueprint

app = Flask(__name__)
CORS(app)

# Register routes with prefixes
app.register_blueprint(pdf_blueprint, url_prefix="/api/pdf")
app.register_blueprint(medical_blueprint, url_prefix="/api/medical")
app.register_blueprint(video_blueprint, url_prefix="/api")

@app.route("/api/health")
def health():
    return jsonify({"ok": True, "service": "unified-flask", "timestamp": "running"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"🚀 Unified Flask server running on port {port}")
    app.run(host="0.0.0.0", port=port)
