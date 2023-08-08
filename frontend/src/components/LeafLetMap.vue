<template>
    <div id="map" class="z-10"></div>
</template>

<script setup>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { onMounted, onUnmounted } from "vue";
import { getUserLocation, getIPLocation } from '../locationServices';
import { ref } from 'vue';
import { watch } from 'vue';

let map = null;
const userLocation = ref({ lat: 51.505, lng: -0.09 }); // Default coordinates

const emit = defineEmits(["markerAdded"]);
const props = defineProps(["listOfCoordinates", "updateSignal", "drawPolylineData"]);

let prevMarker = null; // Variable to store the previous marker
let markers = [];  // Array to store all the current markers
let polylines = [];  // Array to store all the current polylines


function addPolylineWithLabel(coord1, coord2, distance) {
    const latlngs = [
        [coord1.lat, coord1.lng],
        [coord2.lat, coord2.lng]
    ];
    const polyline = L.polyline(latlngs, { color: 'blue' }).addTo(map);
    polylines.push(polyline);

    // Calculate the midpoint
    const computeMidpoint = (latlng1, latlng2) => [(latlng1[0] + latlng2[0]) / 2, (latlng1[1] + latlng2[1]) / 2];
    const midpoint = computeMidpoint(latlngs[0], latlngs[1]);

    // Create a custom L.divIcon for the distance
    const distanceIcon = L.divIcon({
        className: 'distance-label',
        html: distance,
        iconSize: [60, 25]
    });

    L.marker(midpoint, { icon: distanceIcon }).addTo(map);
}

// Remove all polylines and distance labels
function clearPolylinesAndLabels() {
    polylines.forEach(polyline => polyline.remove());
    polylines = [];
    const distanceLabel = document.querySelector('.distance-label');
    if (distanceLabel) {
        distanceLabel.remove();
    }
}

// function to add a marker and its click event
function addMarkerAndEvent(coordinate) {

    const marker = L.marker([coordinate.lat, coordinate.lng]).addTo(map);

    marker.on('click', () => {
        // Get the current zoom level
        const currentZoom = map.getZoom();

        // Focus on the clicked marker
        map.setView([coordinate.lat, coordinate.lng], currentZoom);

        // If there was a previous marker clicked, remove the class from it
        if (prevMarker) {
            prevMarker._icon.classList.remove('markerhuechange');
        }

        // Add the class to the current marker
        marker._icon.classList.add('markerhuechange');

        // Update the previous marker reference to be this marker
        prevMarker = marker;

    });
    markers.push(marker);  // Store this marker in the list
}

// function to refresh the markers on the map on load and on updateSignal change
function refreshMarkers() {
    prevMarker = null; // Reset previous marker

    // Remove existing markers
    markers.forEach(marker => marker.remove());
    markers = [];  // Reset the markers list

    // Add updated markers
    props.listOfCoordinates.forEach(coordinate => {
        addMarkerAndEvent(coordinate);
    });
}

onMounted(async () => {
    // Initialize a new Leaflet map
    map = L.map("map");

    // Get the user's location
    try {
        const location = await getUserLocation();
        userLocation.value = location;
    } catch (error) {
        console.error(error);
        const location = await getIPLocation();
        userLocation.value = location;
    }

    // Set the map view to the user's location
    map.setView([userLocation.value.lat, userLocation.value.lng], 13);

    // Add a tile layer to the map
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors",
        maxZoom: 18,
    }).addTo(map);


    map.on("click", (event) => {
        const { lat, lng } = event.latlng;
        // send coordinates to parent component
        emit("markerAdded", { lat, lng });
        // add markers to map

        // Add marker for the clicked position and its click event
        addMarkerAndEvent({ lat, lng });
    });

    // Add the two given markers
    const initialCoordinates = [
        { "id": 0, "lat": 51.51579343362533, "lng": -0.13149261474609378 },
        { "id": 1, "lat": 51.496667801322666, "lng": -0.07518768310546876 }
    ];
    initialCoordinates.forEach(coordinate => {
        addMarkerAndEvent(coordinate);
    });

    refreshMarkers();
});

onUnmounted(() => {
    map.remove(); // Remove the map instance from memory
});

// Watch for changes in the listOfCoordinates prop
watch(() => props.updateSignal, () => {
    refreshMarkers(); // Refresh the markers when the updateSignal changes
});

// Watch for changes in the drawPolylineData prop
watch(() => props.drawPolylineData, (newValue) => {
    clearPolylinesAndLabels();

    if (newValue.coordPair && newValue.coordPair.length === 2) {
        const distance = newValue.distance;
        addPolylineWithLabel(newValue.coordPair[0], newValue.coordPair[1], distance);
    }
});

</script>


<style scoped>
#map {
    height: 100vh;
    width: 100vw;
}
</style>