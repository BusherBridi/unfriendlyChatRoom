import os

from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from sqlalchemy import create_engine, exc
from sqlalchemy.orm import scoped_session, sessionmaker

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
# Check for environment variable
if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL is not set")

# Set up database
engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))

# Set up socket
socketio = SocketIO(app)


@app.route("/")
def index():
    return render_template("index.html")

@socketio.on("post message")
def message(data):
    msg = data["message"]
    emit("broadcast message", {"message":msg}, broadcast=True)