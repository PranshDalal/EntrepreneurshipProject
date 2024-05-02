from flask import Flask, jsonify, request
from flask import session
from flask_cors import CORS, cross_origin
from flask_bcrypt import Bcrypt
from models import db, User
import requests
import random

app = Flask(__name__)
app.secret_key = "hello"
bcrypt = Bcrypt(app)
CORS(app)


app.config['SECRET_KEY'] = 'testing'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///flaskdb.db'

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
        "status": "New account created",
        "points": new_user.points
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
      
    session["user.id"] = user.id

    print("User ID in session:", session.get("user_id"))

    print(user.points)
  
    return jsonify({
        "id": user.id, 
        "status": "Successfuly logged in",
        "points": user.points
    })

def is_logged_in():
    if "user_id" in session:
        print("Logged in")
    else:
        print("Not logged in")


questions = {
    
}

# Category must be a number. Type is either "boolean" or "multiple"
# Example request: /api/question/multiple/25/easy
@app.route("/api/question/<question_type>/<category>/<difficulty>", methods=["GET"])
def question(question_type, category, difficulty):
    i = 0
    if request.method == "GET":
        response = requests.get(f"{base_url}?amount=5&type={question_type}&category={category}&difficulty={difficulty}").json()

        response_code = response['response_code']

        if response_code != 0:
            return jsonify({
                "response_code": response_code,
                "response_code_message": response_code_messages[response_code]
            })
        
        response_question = response['results'][0]

        while i<5:
            response_q = response['results'][i]
            questions[response_q["question"]] = response_q["correct_answer"]
            i += 1

        print(questions)


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

board = [' '] * 9
current_player = 'X'


current_question = None

def check_win(player):
    for i in range(0, 9, 3):
        if board[i] == board[i + 1] == board[i + 2] == player:
            return True

    for i in range(3):
        if board[i] == board[i + 3] == board[i + 6] == player:
            return True

    if board[0] == board[4] == board[8] == player:
        return True
    if board[2] == board[4] == board[6] == player:
        return True 

    return False

def is_board_full():
    return all(cell != ' ' for cell in board)

def computer_move():
    empty_cells = [index for index, cell in enumerate(board) if cell == ' ']
    if empty_cells:
        return random.choice(empty_cells)
    return None

@app.route("/api/tictactoe/response", methods=['GET', 'POST'])
def tictactoe_response():

    global current_player, current_question, board

    is_logged_in()

    if current_question is None or request.method == 'GET':
        current_question = random.choice(list(questions.keys()))

    if request.method == 'POST':
        data = request.get_json()
        question = data.get('question')
        answer = data.get('answer')

        if question == current_question:
            correct_answer = questions.get(question)
            if answer.lower() == correct_answer.lower():
                current_player = 'X'
                current_question = None

                empty_cells = [index for index, cell in enumerate(board) if cell == ' ']
                if empty_cells:
                    random_position = random.choice(empty_cells)
                    board[random_position] = 'X'

                    if check_win('X'):
                        return jsonify({
                            'message': 'You win!',
                            'board': board,
                            'question': None
                        }), 200

                    if is_board_full():
                        return jsonify({
                            'message': 'It\'s a draw!',
                            'board': board,
                            'question': None
                        }), 200

                    current_player = 'O'
                    computer_position = computer_move()
                    if computer_position is not None:
                        board[computer_position] = 'O'

                        if check_win('O'):
                            return jsonify({
                                'message': 'Computer wins!',
                                'board': board,
                                'question': None
                            }), 200

                    current_player = 'X'
                    current_question = random.choice(list(questions.keys()))
                else:
                    return jsonify({
                        'message': 'It\'s a draw!',
                        'board': board,
                        'question': None
                    }), 200
                
                
            else:
                return jsonify({
                    'message': 'Incorrect answer. Try again.',
                    'board': board,
                    'question': current_question
                }), 400

    return jsonify({
        'message': 'Answer the question to place your X or O.',
        'question': current_question,
        'board': board,
        'currentPlayer': current_player
    })


if __name__ == "__main__":
    app.run(debug=True, port=3001)
