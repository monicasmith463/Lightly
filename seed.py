"""Utility file to seed lights database from data.gov streetlight data in seed_data/"""

# import datetime
from sqlalchemy import func

import json

from model import Light, connect_to_db, db
from server import app


# def load_users(user_filename):
#     """Load users from u.user into database."""
#
#     print "Users"
#
#     for i, row in enumerate(open(user_filename)):
#         row = row.rstrip()
#         user_id, age, gender, occupation, zipcode = row.split("|")
#
#         user = User(age=age,
#                     zipcode=zipcode)
#
#         # Add user to db to initiate storing user data
#         db.session.add(user)
#
#         # provide some sense of progress
#         if i % 100 == 0:
#             print i
#
#     # Once we're done, we should commit our work
#     db.session.commit()
#
#
# def load_movies(movie_filename):
#     """Load movies from u.item into database."""
#
#     print "Movies"
#
#     for i, row in enumerate(open(movie_filename)):
#         row = row.rstrip()
#
#         # clever -- we can unpack part of the row!
#         movie_id, title, released_str, junk, imdb_url = row.split("|")[:5]
#
#         # The date is in the file as daynum-month_abbreviation-year;
#         # we need to convert it to an actual datetime object.
#
#         if released_str:
#             released_at = datetime.datetime.strptime(released_str, "%d-%b-%Y")
#         else:
#             released_at = None
#
#         # Remove the (YEAR) from the end of the title.
#
#         title = title[:-7]   # " (YEAR)" == 7
#
#         movie = Movie(title=title,
#                       released_at=released_at,
#                       imdb_url=imdb_url)
#
#         # We need to add to the session or it won't ever be stored
#         db.session.add(movie)
#
#         # provide some sense of progress
#         if i % 100 == 0:
#             print i
#
#     # Once we're done, we should commit our work
#     db.session.commit()


def load_light_data(filename):
    """Load light data from Boise_Streetlights.json into database."""

    print "Lights"


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


if __name__ == "__main__":
    connect_to_db(app)
    db.create_all()

    data_filename = "seed_data/Boise_Streetlights.json"

    load_light_data(data_filename)
    # set_val_user_id()

load_light_data("seed_data/Boise_Streetlights.json")
