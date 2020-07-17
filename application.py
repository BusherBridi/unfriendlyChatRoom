import os

from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_socketio import SocketIO, emit
from sqlalchemy import create_engine, exc
from sqlalchemy.orm import scoped_session, sessionmaker
import hashlib

application = app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
# Check for environment variable
if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL is not set")


# Set up database
engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))

# Set up socket
socketio = SocketIO(app)

# Homepage/index route
@app.route("/")
def index():
    if(not session):
        return render_template("index.html")
    elif(session["logged_in"] == True):
        return redirect(url_for('chatroom'))
    else:
        return render_template("index.html")
# login route
@app.route("/login", methods = ["POST"])
def login():
    username = str(request.form.get("username").upper())
    password = str(request.form.get("password"))
    passwordHash = hashlib.sha256()
    passwordHash.update(password.encode('utf8'))
    hashedPassword = str(passwordHash.hexdigest())
    if(db.execute("SELECT * FROM users WHERE upper(username) =:username AND password = :password", {"username": username, "password":hashedPassword}).rowcount == 1):
        user = db.execute("SELECT username FROM users WHERE upper(username) =:username",{"username":username}).fetchone()
        session["logged_in"] = True
        session["user_info"] = {"username":user.username}
        return redirect(url_for('chatroom'))
    else:
        return("Wrong Username or Password")
# Chat room route
@app.route("/chatroom")
def chatroom():
    if(not session):
        return redirect(url_for('index'))
    elif(session["logged_in"] == True):
        return render_template("chat.html", username=session["user_info"]["username"])
    else:
        return redirect(url_for('index'))
# Sign up route
@app.route("/signup")
def signup():
    if(not session):
        return render_template("signup.html")
    elif(session["logged_in"] == True):
        return "cannont create account while logged in"
    else:
        return render_template("signup.html")
    
# username check API
@app.route("/checkUsername", methods = ["POST"])
def validiation():
    username = str(request.form.get("username"))
    if(not username):
        pass
    else:
        if(db.execute("SELECT username FROM users WHERE upper(username) =:username", {"username":username.upper()}).rowcount == 1):
            return jsonify({"isTaken":True, "username":username})
        else:
            return jsonify({"isTaken":False, "username":username})

# Dashboard Route 
@app.route("/dashboard")
def dashboard():
    if(not session):
        return redirect(url_for('index')) #General error page instead of redirecting back to index?
    elif(session["logged_in"] == True):
        return render_template("dashboard.html", username=session["user_info"]["username"])
    else:
        return redirect(url_for('index'))
#Create user API
@app.route("/createUser", methods = ["POST"])
def createUser():
    username = str(request.form.get("usernamesu"))
    password = str(request.form.get("passwordsu"))
    passwordConf = str(request.form.get("passwordsuConf"))
    passwordHash = hashlib.sha256()
    passwordHash.update(password.encode('utf8'))
    hashedPassword = str(passwordHash.hexdigest())
    if(len(username) <= 0 or len(password) <= 0):
        return ("you must fill in all the fields")
    elif(password != passwordConf):
        return ("passwords didn't match")
    else:
        db.execute("INSERT INTO users (username, password) VALUES (:username, :password)",{"username":username, "password":hashedPassword})
        db.commit()
        return ("User Created")
    return "error"

# Save dashboard changes API
@app.route("/savechanges", methods = ["POST"])
def savechanges():
    bio = str(request.form.get("bio"))
    announcement = str(request.form.get("announ"))
    url = str(request.form.get("url"))
    location = str(request.form.get("location"))
    
    
#For use in chatroom
@socketio.on("post message")
def message(data):
    msg = data["message"]
    user = data["user"]
    emit("broadcast message", {"message":msg, "user":user}, broadcast=True)

if __name__ == "__main__":
    app.run()