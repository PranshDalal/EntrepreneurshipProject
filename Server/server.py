from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

@app.route("/api/message", methods=['GET'])
def helloworld():
    return "Hello World!"

if __name__ == "__main__":
    app.run(debug=True)

