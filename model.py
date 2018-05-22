"""Models and database functions for the Lightly app."""

from flask_sqlalchemy import SQLAlchemy

# Connect to the PostgreSQL database through the Flask-SQLAlchemy helper library.
#Initiate the `session` object

db = SQLAlchemy()

#####################################################################
# Model definitions

class Light(db.Model):
    """Streetlight object with coordinates."""
    __tablename__ = "lights"

    light_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)

    location = db.Column(db.String(100), nullable=True)

    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(30), nullable=True)
    lamp_type = db.Column(db.String(80), nullable=True)
    wattage = db.Column(db.Integer, nullable=True)

    def __repr__(self):
        """Provide helpful representation when printed."""

        return "<Light light_id={} latitude={} longitude={} location={} status={} lamp_type={} wattage={}>".format(self.light_id, self.latitude,
                                               self.longitude, self.location, self.status, self.lamp_type, self.wattage)

class User(db.Model):
        """User data including fname, lname, email, password."""

#####################################################################
# Helper functions

def connect_to_db(app):
    """Connect the database to our Flask app."""

    # Configure to use our PostgreSQL database
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///lights'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.app = app
    db.init_app(app)


if __name__ == "__main__":

    from server import app
    connect_to_db(app)
    print "Connected to DB."
