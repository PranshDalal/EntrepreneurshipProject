from flask import Flask, jsonify, request, session
from flask_cors import CORS, cross_origin
from flask_bcrypt import Bcrypt
from models import db, User
import requests

app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app)

app.config['SECRET_KEY'] = 'testing'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///flaskdb.db'

# CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://localhost:3001"]}})

# https://opentdb.com/api_config.php
base_url = "https://opentdb.com/api.php"

response_code_messages = [
    "Sucess",
    "No Result",
    "Invalid Parameter",
    "Token Empty"
    "Rate Limit",
]

SQLALCHEMY_TRACK_NOTIFICATIONS = True
SQLALCHEMY_ECHO = True

db.init_app(app)

with app.app_context():
    db.create_all()

@app.route("/helloworld", methods=['GET'])
def helloworld():
    return jsonify({"message": "Hello World!"})


@app.route("/signup", methods=['POST'])
def signup():
    email = request.json["email"]
    password = request.json["password"]

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "This email is already in use"}), 400
    
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    session["user_id"] = new_user.id
    return jsonify({
        "id": new_user.id,
        "email": new_user.email,
        "status": "New account created"
    })


@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]
    print("Email:", email)

    user_query = User.query.filter_by(email=email)
    print(user_query)
    user = user_query.first()
    print(user)

  
    if user is None:
        return jsonify({"error": "Incorrect email or password"}), 401
  
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Incorrect email or password"}), 401
      
    session["user_id"] = user.id
  
    return jsonify({
        "id": user.id, 
        "status": "Successfuly logged in"
    })



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