"""Streetlights."""

from jinja2 import StrictUndefined

from flask import Flask, render_template, request, flash, redirect, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension

from model import connect_to_db, db, Light


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

@app.route('/map')
def map():
    """Map."""
    #
    # lights = Light.query.all()

    return render_template("mapBoise.html")

@app.route('/login', methods=['GET'])
def login_form():
    """Show login form."""

    return render_template("login.html")


@app.route('/login', methods=['POST'])
def login_process():
    """Process login."""

    # Get form variables
    email = request.form["email"]
    password = request.form["password"]

    # user = User.query.filter_by(email=email).first()
    #
    # if not user:
    #     flash("No such user")
    #     return redirect("/login")
    #
    # if user.password != password:
    #     flash("Incorrect password")
    #     return redirect("/login")

    session["user_id"] = user.user_id

    flash("Logged in")
    # return redirect("/users/{}".format(user.user_id))

@app.route('/coordinate-data')
def get_coordinates():
    """Route to get coordinates from database and jsonify."""

    coordinates = db.session.query(Light.latitude, Light.longitude).all()
    return jsonify(coordinates)


if __name__ == "__main__":
    # We have to set debug=True here, since it has to be True at the point
    # that we invoke the DebugToolbarExtension
    app.debug = True

    connect_to_db(app)

    # Use the DebugToolbar
    DebugToolbarExtension(app)

    app.run(host="0.0.0.0")
