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
const props = defineProps(["listOfCoordinates", "updateSignal"]);

let prevMarker = null;
let markers = [];  // Array to store all the current markers



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

function refreshMarkers() {


    // check if prevMarker is still in the list of markers
    if (prevMarker && markers.includes(prevMarker)) {
        prevMarker = null;
    }

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

    refreshMarkers();
});

onUnmounted(() => {
    map.remove(); // Remove the map instance from memory
});

watch(() => props.updateSignal, () => {
    refreshMarkers(); // Refresh the markers when the updateSignal changes
});

</script>


<style scoped>
#map {
    height: 100vh;
    width: 100vw;
}
</style>