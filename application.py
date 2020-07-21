import os

from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit
from sqlalchemy import create_engine, exc
from sqlalchemy.orm import scoped_session, sessionmaker
import hashlib, re

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

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/login", methods = ["POST"])
def login():
    username = str(request.form.get("username").upper())
    password = str(request.form.get("password"))
    passwordHash = hashlib.sha256()
    passwordHash.update(password.encode('utf8'))
    hashedPassword = str(passwordHash.hexdigest())
    if(db.execute("SELECT * FROM users WHERE upper(username) =:username AND password = :password", {"username": username, "password":hashedPassword}).rowcount == 1):
        user = db.execute("SELECT username FROM users WHERE upper(username) =:username",{"username":username}).fetchone()
        return render_template("chat.html", username=user.username)
    else:
        return("Wrong Username or Password")

@app.route("/signup")
def signup():
    return render_template("signup.html")

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


@socketio.on("post message")
def message(data):
    msg = data["message"]
    user = data["user"]

    print(re.search(':([A-Za-z0-9_\./\\-]*):', msg))

    i = 0;
    while i < len(msg):
        emo = re.search(':([A-Za-z0-9_\./\\-]*):', msg, i)
        if(emo == None):
            break;

        #url = "https://www.google.com/search?q=" + emo.group(1) + "&source=lnms&tbm=isch&sa=X&ved=2ahUKEwiQyoDsst7qAhWRMX0KHbNMDw4Q_AUoAXoECBwQAw&biw=1038&bih=852"
        #print(url)
        link = "https://picsum.photos/50"
        img = "<img src=" + link + ">"

        msg = msg.replace(emo.group(), img)

        #print(emo.start())
        #print(emo.end())
        i += len(img);




    emit("broadcast message", {"message":msg, "user":user}, broadcast=True)

if __name__ == "__main__":
    app.run()
