<template>
    <div id="map"></div>
</template>

<script setup>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { onMounted, onUnmounted } from "vue";
import { getUserLocation, getIPLocation } from '../locationServices';
import { ref } from 'vue';

let map = null;
const userLocation = ref({ lat: 51.505, lng: -0.09 }); // Default coordinates



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
});

onUnmounted(() => {
    map.remove(); // Remove the map instance from memory
});
</script>


<style scoped>
#map {
    height: 100vh;
    width: 100vw;
}
</style>