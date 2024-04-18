from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://localhost:3001"]}})

@app.route("/api/message", methods=['GET'])
def helloworld():
    return jsonify({"message": "Hello World!"})

if __name__ == "__main__":
    app.run(debug=True, port=3001)
