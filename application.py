import os
import re
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
connectedUsers = []

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
@app.route("/login", methods=["POST"])
def login():
    username = str(request.form.get("username").upper())
    password = str(request.form.get("password"))
    passwordHash = hashlib.sha256()
    passwordHash.update(password.encode('utf8'))
    hashedPassword = str(passwordHash.hexdigest())
    if(db.execute("SELECT * FROM users WHERE upper(username) =:username AND password = :password", {"username": username, "password": hashedPassword}).rowcount == 1):
        user = db.execute("SELECT username FROM users WHERE upper(username) =:username", {
                          "username": username}).fetchone()
        session["logged_in"] = True
        session["user_info"] = {"username": user.username}
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

# Dashboard Route
@app.route("/dashboard")
def dashboard():
    if(not session):
        # General error page instead of redirecting back to index?
        return redirect(url_for('index'))
    elif(session["logged_in"] == True):
        return render_template("dashboard.html", username=session["user_info"]["username"])
    else:
        return redirect(url_for('index'))
# userpage route
@app.route("/<string:username>")
def userpage(username):
    isuserexist = db.execute("SELECT * FROM users WHERE username =:username",{"username":username}).rowcount
    if( isuserexist != 1):
        return render_template("error.html"), 404
    else:
        user = db.execute("SELECT * FROM users WHERE username =:username",{"username":username}).fetchone()
        bio = user.bio
        url = user.url
        profilePic = user.profilepicurl
        location = user.location
    return render_template("userpage.html",user=username, bio=bio, url=url, profilepic= profilePic, location=location)
#logout API
@app.route("/logout")
def logout():
    session["logged_in"] = False
    return ("logged out")
# Create user API
@app.route("/createUser", methods=["POST"])
def createUser():
    username = str(request.form.get("usernamesu"))
    password = str(request.form.get("passwordsu"))
    passwordConf = str(request.form.get("passwordsuConf"))
    passwordHash = hashlib.sha256()
    passwordHash.update(password.encode('utf8'))
    hashedPassword = str(passwordHash.hexdigest())
    #makes sure user inputted password and username
    if(len(username) <= 0 or len(password) <= 0):
        return ("you must fill in all the fields")
    elif(password != passwordConf):
        return ("passwords didn't match")
    #checks to make sure password matches reqs using a regex
    elif(not re.match("(?=^[A-Za-z])(?=^.{8,330}$)(?=.*[!@#$%^&*]+)(?=^\S+$)(?=.*\d{1,})(?=.*[a-z]{1,})(?=.*[A-Z]{1,}).*$",password)):
        return ("passwords does not meet the criteria")
    #checks to make sure username matches reqs using a regex
    elif(not re.match("(?=^[A-Za-z])(?=^.{6,64}$).*$",username)):
        return ("username does not meet the criteria")
    else:
        db.execute("INSERT INTO users (username, password) VALUES (:username, :password)", {
                   "username": username, "password": hashedPassword})
        db.commit()
        return ("User Created")
    return "error"


# username check API
@app.route("/checkUsername", methods=["POST"])
def validiation():
    username = str(request.form.get("username"))
    if(not username):
        pass
    else:
        if(db.execute("SELECT username FROM users WHERE upper(username) =:username", {"username": username.upper()}).rowcount == 1):
            return jsonify({"isTaken": True, "username": username})
        else:
            return jsonify({"isTaken": False, "username": username})

# Get Changes API
@app.route("/getchanges", methods = ["POST"])
def getchanges():
    username = session["user_info"]["username"]
    try:
        userDashboard= db.execute("SELECT bio, announcement, url, location, profilepicurl FROM users WHERE username = :username",{"username":username}).fetchone()
        data = jsonify({"success":True,"bio":userDashboard.bio,"announcement":userDashboard.announcement,"url":userDashboard.url,"location":userDashboard.location, "profilePicUrl":userDashboard.profilepicurl})
    except:
        data = jsonify({"success":False})
    return data

# Save dashboard changes API
@app.route("/savechanges", methods=["POST"])
def savechanges():
    username = session["user_info"]["username"]
    bio = str(request.form.get("bio"))
    announcement = str(request.form.get("announcement"))
    url = str(request.form.get("url"))
    location = str(request.form.get("location"))
    try:
        db.execute("UPDATE users SET bio =:bio, announcement =:announcement, url =:url, location =:location WHERE username = :username", {"bio":bio, "announcement":announcement, "url":url,"location":location, "username":username})
        db.commit()
        data = jsonify({"saved":True})
    except:
        data = jsonify({"saved":False})
    return data

# Save profilePicUrl to db API
@app.route("/changePic", methods = ["POST"])
def changePic():
    username = session["user_info"]["username"]
    profilePicUrl = str(request.form.get("profilePicUrl"))
    try:
        db.execute("UPDATE users SET profilepicurl =:profilepicurl WHERE username = :username",{"profilepicurl":profilePicUrl, "username":username})
        db.commit()
        data = jsonify({"saved":True})
    except:
        data = jsonify({"saved":False})
    return data

# For use in chatroom
@socketio.on("post message")
def message(data):
    msg = data["message"]
    user = data["user"]
    emit("broadcast message", {"message":msg, "user":user}, broadcast=True)

""" this should be a comment omega
@socketio.on("user connected")
def emitNewOnlineUser(data):
    uname = data["uname"]
    emit("add new online", {"user":uname}, broadcast=True)
    emit("get usernames", {"newUserId" : },broadcast=False)

@socketio.on("emit username")
def getOnlineList(data):

"""

@socketio.on("update online list")
def updateOnline():
    emit("send username", broadcast=True)

@socketio.on("pass username")
def updateUsers(data):
    emit("add new online", {"uname" : data["uname"]}, broadcast=True)

if __name__ == "__main__":
    app.run()
