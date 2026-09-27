const map = L.map("map").setView([-1.9441, 30.0619], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

const startInput = document.getElementById("start");
const destinationInput = document.getElementById("destination");
const routeButton = document.getElementById("route-btn");
const routeInfo = document.getElementById("route-info");

let routeLine = null;
let startMarker = null;
let destinationMarker = null;

async function getCoordinates(location) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.length === 0) {
        throw new Error(`Location not found: ${location}`);
    }

    return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
    };
}

async function getRoute(start, destination) {
    const url = `https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${destination.lon},${destination.lat}?overview=full&geometries=geojson`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.code !== "Ok") {
        throw new Error("Could not find a route.");
    }

    return data.routes[0];
}

routeButton.addEventListener("click", async function () {
    const startLocation = startInput.value.trim();
    const destinationLocation = destinationInput.value.trim();

    if (!startLocation || !destinationLocation) {
        routeInfo.innerHTML = `
            <p>Please enter both a starting location and a destination.</p>
        `;
        return;
    }

    routeButton.disabled = true;
    routeButton.textContent = "Finding Route...";
    routeInfo.innerHTML = `<p>Finding your route...</p>`;

    try {
        const startCoordinates = await getCoordinates(startLocation);
        const destinationCoordinates = await getCoordinates(destinationLocation);

        const route = await getRoute(
            startCoordinates,
            destinationCoordinates
        );

        if (routeLine) {
            map.removeLayer(routeLine);
        }

        if (startMarker) {
            map.removeLayer(startMarker);
        }

        if (destinationMarker) {
            map.removeLayer(destinationMarker);
        }

        routeLine = L.geoJSON(route.geometry).addTo(map);

        startMarker = L.marker([
            startCoordinates.lat,
            startCoordinates.lon
        ]).addTo(map);

        startMarker.bindPopup(
            `<strong>Start:</strong> ${startLocation}`
        );

        destinationMarker = L.marker([
            destinationCoordinates.lat,
            destinationCoordinates.lon
        ]).addTo(map);

        destinationMarker.bindPopup(
            `<strong>Destination:</strong> ${destinationLocation}`
        );

        const distance = (route.distance / 1000).toFixed(1);
        const duration = Math.round(route.duration / 60);

        routeInfo.innerHTML = `
            <strong>Distance:</strong> ${distance} km
            &nbsp; | &nbsp;
            <strong>Estimated time:</strong> ${duration} minutes
        `;

        map.fitBounds(routeLine.getBounds());

    } catch (error) {
        routeInfo.innerHTML = `
            <p>Sorry, we couldn't find a route. Please check the locations and try again.</p>
        `;

        console.error(error);

    } finally {
        routeButton.disabled = false;
        routeButton.textContent = "Show Route";
    }
});