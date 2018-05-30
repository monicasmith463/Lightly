"""Utility file to seed lights database from data.gov streetlight data in seed_data/"""

# import datetime
import random
from sqlalchemy import func
from faker import Faker
fake = Faker()
import json

from model import Light, User, connect_to_db, db
from server import app

#hardcode the number of fake users to be added to database

def load_light_data(filename):
    """Load light data from Boise_Streetlights.json into database."""

    lights = open(filename).read()

    lights = json.loads(lights)['features']

    for i, light in enumerate(lights):
        properties = light['properties']

        location = properties['Location']
        status = properties['Status']

        #coordinates are type float
        longitude, latitude = light['geometry']['coordinates']
        lamp_type = properties['Lamp_Type']

        #wattage is type int
        wattage = properties['Wattage']


        light = Light(location=location, latitude=latitude, longitude=longitude, status=status,
                      lamp_type=lamp_type, wattage=wattage)
        print light
        # Add each light object to the session
        db.session.add(light)

        # Mark each periodic commit
        if i % 1000 == 0:
            print "Commit to database: ", i

            #Commit every 1000 entries to prevent program from choking

            db.session.commit()

    # Commit at the end
    db.session.commit()

def load_user_data():
    """Load fake user data to seed database."""
    #characters for generating passwords
    chars = "ABCDEFGHJKLMNPQRSTUVWXYZ123456789"
    #load 200 users
    for i in range(1):
        username = fake.name()
        password = ''.join(map(lambda x: random.choice(chars), range(random.randint(6, 10))))
        print "password: ", password
        user = User(username=username, password=password)
        print user
        db.session.add(user)
    db.session.commit()

if __name__ == "__main__":
    connect_to_db(app)
    db.create_all()

    data_filename = "seed_data/Boise_Streetlights.json"

    # load_light_data(data_filename)
    load_user_data()
    # set_val_user_id()

# load_light_data("seed_data/Boise_Streetlights.json")
