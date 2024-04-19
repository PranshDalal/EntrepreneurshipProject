from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://localhost:3001"]}})

# https://opentdb.com/api_config.php
base_url = "https://opentdb.com/api.php"

response_code_messages = [
    "Sucess",
    "No Result",
    "Invalid Parameter",
    "Token Empty"
    "Rate Limit",
]

@app.route("/helloworld", methods=['GET'])
def helloworld():
    return jsonify({"message": "Hello World!"})

# Category must be a number. Type is either "boolean" or "multiple"
# Example request: /api/question/multiple/25/easy
@app.route("/api/question/<question_type>/<category>/<difficulty>", methods=["GET"])
def question(question_type, category, difficulty):
    if request.method == "GET":
        response = requests.get(f"{base_url}?amount=1&type={question_type}&category={category}&difficulty={difficulty}").json()

        response_code = response['response_code']

        if response_code != 0:
            return jsonify({
                "response_code": response_code,
                "response_code_message": response_code_messages[response_code]
            })
        
        response_question = response['results'][0]

        return jsonify({
            "response_code": response_code,
            "response_code_message": response_code_messages[response_code],
            "type": response_question["type"],
            "difficulty": response_question["difficulty"],
            "category": response_question["category"],
            "question": response_question["question"],
            "correct_answer": response_question["correct_answer"],
            "incorrect_answers": response_question["incorrect_answers"]
        })

if __name__ == "__main__":
    app.run(debug=True, port=3001)
