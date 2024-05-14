from flask import Flask, jsonify, request, session, redirect, url_for
from flask_session import Session
from flask_cors import CORS, cross_origin
from flask_bcrypt import Bcrypt
from models import db, User
import requests
import random


print("Hello world")

app = Flask(__name__)
app.secret_key = "hello"
bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config.from_object(__name__)
Session(app)

# NOTE: ADDED THIS SESSION COOKIE HTTPONLY THING BEC COULDN'T CHECK IF SIGNED IN FROM CLIENT
app.config.update(SESSION_COOKIE_HTTPONLY=False)
app.config.update(SESSION_COOKIE_SAMESITE="None", SESSION_COOKIE_SECURE=True)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///flaskdb.db'

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

def is_logged_in():
    return "user_id" in session and session["user_id"] is not None

@app.route("/helloworld", methods=['GET'])
def helloworld():
    return jsonify({"message": "Hello World!"})

@app.route("/signup", methods=['POST', 'GET'])
def signup():
    email = request.json["email"]
    password = request.json["password"]
    username = request.json["username"]

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "This email is already in use"}), 400
    
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(email=email, password=hashed_password, username=username)
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
    username = request.json["username"]
    password = request.json["password"]

    user_query = User.query.filter_by(username=username)
    print(user_query)
    user = user_query.first()
    print(user)

    if user is None or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Incorrect username or password"}), 401
    
    session["user_id"] = user.id
    print(session)
    session.modified = True

    print("User ID in session:", session.get("user_id"))

    print(user.points)
  
    return jsonify({
        "id": user.id, 
        "status": "Successfuly logged in",
        "points": user.points
    })

@app.route("/logout", methods=["GET"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out"})




questions = {
    
}

def generate_questions(question_type, category, difficulty, amount=1):
    response = requests.get(f"{base_url}?amount={amount}&type={question_type}&category={category}&difficulty={difficulty}").json()

    return response

# Category must be a number. Type is either "boolean" or "multiple"
# Example request: /api/question/multiple/25/easy
@app.route("/api/question/<question_type>/<category>/<difficulty>", defaults={'amount': 5}, methods=["GET"])
@app.route("/api/question/<question_type>/<category>/<difficulty>/<amount>", methods=["GET"])
def question(question_type, category, difficulty, amount):
    i = 0
    max_questions = amount

    if request.method == "GET":
        response = generate_questions(question_type, category, difficulty, amount)
        # response = requests.get(f"{base_url}?amount={amount}&type={question_type}&category={category}&difficulty={difficulty}").json()

        response_code = response['response_code']

        if response_code != 0:
            return jsonify({
                "response_code": response_code,
                "response_code_message": response_code_messages[response_code]
            })
        
        response_question = response['results'][0]

        while i < max_questions:
            response_q = response['results'][i]
            questions[response_q["question"]] = response_q["correct_answer"]
            i += 1

        session["questions"] = questions


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
    session.modified = True
    print(session.get("user_id"))
    if not session.get("user_id"):
        return jsonify({"error": "Please log in first"}), 401


    if not questions or current_question is None or request.method == 'GET':
        if not questions:
            current_question = None
        else:
            current_question = random.choice(list(questions.keys()))

    if request.method == 'POST':
        data = request.get_json()
        question = data.get('question')
        answer = data.get('answer')

        if question == current_question:
            correct_answer = questions.get(question)
            print(correct_answer)
            if answer.lower() == correct_answer.lower():
                user_id = session.get("user_id")
                user = User.query.get(user_id)
                user.points += 10
                db.session.commit()
                print(user.points)

                current_player = 'X'
                current_question = None

                empty_cells = [index for index, cell in enumerate(board) if cell == ' ']
                if empty_cells:
                    random_position = random.choice(empty_cells)
                    board[random_position] = 'X'

                    if check_win('X'):
                        questions.clear()
                        return jsonify({
                            'message': 'You win!',
                            'board': board,
                            'question': None
                        }), 200

                    if is_board_full():
                        questions.clear()
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
                            questions.clear()
                            return jsonify({
                                'message': 'Computer wins!',
                                'board': board,
                                'question': None
                            }), 200

                    current_player = 'X'
                    current_question = random.choice(list(questions.keys()))
                else:
                    questions.clear()
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

@app.route("/restart-game", methods=["POST"])
def restart_game():
    global current_player, current_question, board, questions
    
    current_player = 'X'
    board = [' '] * 9
    questions.clear()

    current_question = None
    
    return jsonify({"message": "Game restarted successfully"}), 200


@app.route('/points')
def get_points():
    user_id = session.get("user_id")
    if user_id:
        user = User.query.get(user_id)
        if user:
            return jsonify({
                "points": user.points
            })
        else:
            return jsonify({"error": "User not found"}), 404
    else:
        return jsonify({"error": "User not logged in"}), 401


@app.route('/leaderboard')
def get_leaderboard():
    try:
        users = User.query.order_by(User.points.desc()).all()
        leaderboard = []
        for user in users:
            leaderboard.append({
                'username': user.username,
                'points': user.points
            })

        return jsonify({'leaderboard': leaderboard})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

hangman_word = None
hangman_word_state = None
words = []
hangman_figure = [
    " ________     ",
    "|        |    ",
    "|        0    ",
    "|       /|\   ",
    "|       / \   ",
    "|             ",
    "=============="
]
incorrect_guesses = 0
max_attempts = 6

def start_new_game():
    for question, answer in questions.items():
        words.append(answer.upper())
        
    global hangman_word, hangman_word_state, hangman_figure, incorrect_guesses
    hangman_word = random.choice(words)
    hangman_word = "".join(hangman_word.split())
    print(hangman_word)
    hangman_word_state = ['_'] * len(hangman_word)
    incorrect_guesses = 0


def make_guess(guess):
    global hangman_word, hangman_word_state, incorrect_guesses
    if guess in hangman_word:
        for i in range(len(hangman_word)):
            if hangman_word[i] == guess:
                hangman_word_state[i] = guess
        return True
    else:
        incorrect_guesses += 1
        return False

@app.route("/api/hangman", methods=['GET', 'POST'])
def hangman():
    global hangman_word, hangman_word_state, hangman_figure, incorrect_guesses

    if request.method == 'GET':
        action = request.args.get('action')

        if action == 'start':
            start_new_game()
            return jsonify({"message": "New game started.", "hangman_word_state": hangman_word_state})
        elif action == 'start_with_question':
            question, answer = random.choice(list(questions.items()))
            hangman_word = answer.lower()
            hangman_word_state = ['_'] * len(hangman_word)
            incorrect_guesses = 0
            return jsonify({"message": "New game started with a question.", "question": question, "hangman_word_state": hangman_word_state})
        else:
            return jsonify({"error": "Invalid action. Please specify 'start' or 'start_with_question'."}), 400

    elif request.method == 'POST':
        data = request.get_json()
        guess = data.get('guess', '')

        if not guess.isalpha() or len(guess) != 1:
            return jsonify({"error": "Invalid guess. Please enter a single letter."}), 400

        if not hangman_word:
            return jsonify({"error": "Game has not started. Please start a new game."}), 400

        if guess in hangman_word_state:
            return jsonify({"message": "You already guessed that letter.", "hangman_word_state": hangman_word_state}), 200

        if make_guess(guess):
            if '_' not in hangman_word_state:
                user_id = session.get("user_id")
                user = User.query.get(user_id)
                user.points += 25
                db.session.commit()
                return jsonify({"message": "Congratulations! You won!", "hangman_word": hangman_word, "hangman_word_state": hangman_word_state}), 200
            else:
                return jsonify({"message": "Correct guess!", "hangman_word_state": hangman_word_state}), 200
        else:
            if incorrect_guesses >= max_attempts:
                return jsonify({"message": "Game over. You lost!", "hangman_word": hangman_word, "hangman_word_state": hangman_word_state, "hangman_figure": hangman_figure}), 200
            else:
                return jsonify({"message": "Incorrect guess!", "hangman_word_state": hangman_word_state, "hangman_figure": hangman_figure[:incorrect_guesses + 1]}), 200



def streaks_next_question():
    session['streaks_current_question'] = session['streaks_generated_questions'][0]
    session['streaks_generated_questions'].pop(0);
    session['streaks_correct_answer'] = session.get('streaks_current_question')['correct_answer']

@app.route("/api/streaks/response", methods=['GET', 'POST'])
def streaks():
    if request.method == 'GET':
        if session.get('streaks_generated_questions') is None:
            generated_questions = generate_questions("multiple", 9, "easy", 50)

            if generated_questions['response_code'] == 0:
                session['streaks_generated_questions'] = generated_questions['results']
            
            else:
                return jsonify({
                    "response_code": generated_questions.response_code,
                    "response_code_message": response_code_messages[generated_questions.response_code],
                })
        
        if session.get('current_streak') is None:
            session['current_streak'] = 0

        if session.get('streaks_current_question') is None:
            streaks_next_question()

        combined_answers = session.get('streaks_current_question')['incorrect_answers'] + [session.get('streaks_current_question')['correct_answer']]
        random.shuffle(combined_answers)

        return jsonify({
            'question': session.get('streaks_current_question')['question'],
            'possible_answers': combined_answers,
            'current_streak': session.get('current_streak')
        })
    
    elif request.method == "POST":
        data = request.get_json()
        question = data.get('question')
        answer = data.get('answer')

        correct_answer = session['streaks_correct_answer']
        if answer.lower() == correct_answer.lower():
            user_id = session.get("user_id")
            user = User.query.get(user_id)
            user.points += 10
            db.session.commit()
            session['current_streak'] += 1
            streaks_next_question()

            return jsonify({
                'message': 'Correct answer.',
                'current_streak': session.get('current_streak'),
                'question': session.get('streaks_current_question')
            })
        else:
            session['current_streak'] = 0
            streaks_next_question()
            return jsonify({
                'message': 'Incorrect answer. Streak reset to 0.',
                'current_streak': session.get('current_streak'),
                'question': session.get('streaks_current_question')
            })

@app.route("/api/streaks/restart", methods=['POST'])
def restart_streaks():
    session['current_streak'] = 0
    session['streaks_current_question'] = None
    session['streaks_generated_questions'] = None
    return jsonify({"message": "Streaks game restarted successfully"})

if __name__ == "__main__":
    app.run(debug=True, port=3001)