"""Streetlights."""

from jinja2 import StrictUndefined

import os
import json
from flask import Flask, render_template, request, flash, redirect, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension

from model import connect_to_db, db, Light, User


app = Flask(__name__)

# Required to use Flask sessions and the debug toolbar
app.secret_key = "ABC"
GMAPS_API_KEY = os.environ['GMAPS_API_KEY']

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


@app.route('/register', methods=['POST'])
def register_process():
    """Process registration."""

    # Get form variables
    username = request.form["username"]
    password = request.form["password"]
    confirm = request.form["confirm"]
    email = request.form["email"]
    zipcode = request.form["zipcode"]

    username_exists = User.query.filter_by(username=username).first()

    if username_exists:
        flash("Username already exists.")
        return redirect("/register")

    if confirm != password:
        flash("Please confirm password.")
        return redirect("/register")

    # create new user
    new_user = User(username=username, password=password, email=email, zipcode=zipcode)

    # add new user to database
    db.session.add(new_user)
    db.session.commit()

    flash("User {} added.".format(username))

    # automatically log user in
    session["user_id"] = User.query.filter_by(username=username).first().user_id

    return redirect("/")

@app.route('/map')
def map():
    """Map."""

    return render_template("map.html", GMAPS_API_KEY=GMAPS_API_KEY)


@app.route('/login', methods=['GET'])
def login():
    """Show login form, process login request on successful post."""

    return render_template("login.html")


@app.route('/login', methods=['POST'])
def process_login():
    """Get login info from form."""

    # Get form variables
    username = request.form["username"]
    password = request.form["password"]

    user = User.query.filter_by(username=username).first()

    if not user:
        flash("User does not exist.")
        return redirect("/login")


    if user.password != password:
        flash("Incorrect password")
        return redirect("/login")

    session["user_id"] = user.user_id

    flash("Logged in")
    return redirect("/")

@app.route('/logout')
def logout():
    """Log out."""

    del session["user_id"]
    flash("Logged Out.")
    return redirect("/")

@app.route("/account/<int:user_id>")
def user_detail(user_id):
    """Show info about user."""

    user = User.query.filter_by(user_id=user_id).first()
    return render_template("user.html", user=user)

@app.route('/coordinate-data')
def get_coordinates():
    """Route to get coordinates from database and jsonify."""

    coordinates = db.session.query(Light.latitude, Light.longitude).all()
    print("coordinates", coordinates)
    return jsonify(coordinates)

if __name__ == "__main__":
    # We have to set debug=True here, since it has to be True at the point
    # that we invoke the DebugToolbarExtension
    app.debug = True
    app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
    app.jinja_env.auto_reload = app.debug
    connect_to_db(app)

    # Use the DebugToolbar
    DebugToolbarExtension(app)

    app.run(host="0.0.0.0")
