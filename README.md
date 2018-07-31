# Lightly

Lightly is a map routing application that optimizes routes based on the geolocations of streetlights. The goal is to provide the user a route with better nighttime visibility, making walking after dark a more comfortable experience. Lightly's algorithm utilizes the Routeboxer library to determine the number of streetlights positioned within proximity of each route. Then it calculates the overall density of light locations, displaying the best-lit route to the user. Users are notified if the best-lit route is significantly longer than the shortest route, which they may choose to opt for instead. Dynamic login and register forms were created with React.

## How to Get Started
1. Clone this repo.
2. Obtain a Google maps API key. Further instructions here: https://developers.google.com/maps/documentation/javascript/get-api-key
3. Store your Google maps API key in your own ```secrets.sh``` file, and be sure this file's name is included in your repository's ```.gitignore```.
4. Install the requirements:
```
pip install -r requirements.txt
```
5. Create a virtual environment within your project directory:
```
virtualenv env
```
6. Activate the ```env``` each time before running the app:
```
source env/bin/activate
```
7. Create the database for light coordinate data:
```
createdb lights
```

8. Seed the database, reading the data from ```Boise_Streetlights.json```, using:
```
python seed.py
```
9. You are now ready to run the app in the browser:
```
python server.py
```
10. Navigate to the local host ```http://0.0.0.0:5000/```.

