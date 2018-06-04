"""Streetlights."""

from jinja2 import StrictUndefined

import json
from flask import Flask, render_template, request, flash, redirect, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension

from model import connect_to_db, db, Light, User


app = Flask(__name__)

# Required to use Flask sessions and the debug toolbar
app.secret_key = "ABC"

# Normally, if you use an undefined variable in Jinja2, it fails silently.
# This is horrible. Fix this so that, instead, it raises an error.
app.jinja_env.undefined = StrictUndefined

@app.route('/')
def index():
    """Homepage."""

    return render_template("homepage.html")

@app.route('/register', methods=['GET'])
def register_form():
    """Show form for user signup."""

    return render_template("register.html")


@app.route('/registerUser', methods=['POST'])
def register_process():
    """Process registration."""

    # Get form variables
    username = request.form["username"]
    password = request.form["password"]
    return json.dumps({'status':'OK','username':username,'pass':password});
    new_user = User(username=username, password=password)

    db.session.add(new_user)
    db.session.commit()

    flash("User {} added.".format(email))
    return redirect("/users/{}".format(new_user.user_id))

@app.route('/map')
def map():
    """Map."""

    return render_template("map.html")

@app.route('/login', methods=['GET'])
def login_form():
    """Show login form."""

    return render_template("login.html")


@app.route('/login', methods=['POST'])

def get_login_info():
    """Get login info from form."""

    # Get form variables
    username = request.form["username"]
    password = request.form["password"]
    process_login(username, password)
    return json.dumps({'status':'OK','username':username,'pass':password});

def process_login(username, password):
    """process_login"""
    user = User.query.filter_by(username=username).first()


    if not username:
        flash("working")
        return redirect("/login")


    # if user.password != password:
    #     flash("Incorrect password")
    #     return redirect("/login")
    #
    # session["user_id"] = user.user_id

    flash("Logged in")
    # return redirect("/users/{}".format(user.user_id))


@app.route('/logout')
def logout():
    """Log out."""

    del session["user_id"]
    flash("Logged Out.")
    return redirect("/")

@app.route("/users/<int:user_id>")
def user_detail(user_id):
    """Show info about user."""

    user = User.query.options(db.joinedload('ratings').joinedload('movie')).get(user_id)
    return render_template("user.html", user=user)

    session["user_id"] = user.user_id

    flash("Logged in")

@app.route('/coordinate-data')
def get_coordinates():
    """Route to get coordinates from database and jsonify."""

    coordinates = db.session.query(Light.latitude, Light.longitude).all()
    return jsonify(coordinates)


if __name__ == "__main__":
    # We have to set debug=True here, since it has to be True at the point
    # that we invoke the DebugToolbarExtension
    app.debug = True
    app.jinja_env.auto_reload = app.debug
    connect_to_db(app)

    # Use the DebugToolbar
    DebugToolbarExtension(app)

    app.run(host="0.0.0.0")
