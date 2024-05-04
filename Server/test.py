from flask import Flask, session
from flask_session import Session

app = Flask(__name__)
SESSION_TYPE = 'filesystem'
app.config.from_object(__name__)
Session(app)

msg = "Hello World"

@app.route("/set")
def set_session():
    session["message"] = "Hello World"
    return "<h1>0k</h1>"

@app.route("/get")
def get_session():
    stored_session = session.get("message", "no session was set")
    return f'<h3>{stored_session}</h3>'


app.run(debug=True, port=5001)