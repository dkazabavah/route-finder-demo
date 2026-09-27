# Route Finder

A small web application that allows users to enter two locations and view the driving route between them on an interactive map.

## Features

- Search for two locations
- Display locations on an interactive map
- Show driving route between locations
- Display start and destination markers
- Show route distance
- Show estimated travel time
- Handle invalid or missing locations
- Responsive design for desktop and mobile

## Technologies Used

- HTML
- CSS
- JavaScript
- Leaflet.js
- OpenStreetMap
- Nominatim
- OSRM

## How It Works

1. The user enters a starting location and destination.
2. Nominatim converts the location names into geographic coordinates.
3. OSRM uses the coordinates to calculate a driving route.
4. Leaflet displays the route and markers on the map.
5. The application displays the estimated distance and travel time.

## How to Run

1. Clone the repository.
2. Open the project folder in VS Code.
3. Open `index.html` with Live Server.
4. Enter two locations.
5. Click **Show Route**.

## Example

Try:

`Kigali, Rwanda`

to:

`Musanze, Rwanda`

## APIs and Services

This project uses:

- OpenStreetMap for map data
- Nominatim for geocoding
- OSRM for route calculation
- Leaflet for displaying the interactive map

## Project Structure

```text
route-demo/
├── index.html
├── style.css
├── script.js
└── README.md