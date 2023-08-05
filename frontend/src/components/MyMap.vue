<template>
    <div id="map"></div>
</template>

<script setup>
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { onMounted, onUnmounted } from "vue";

let map = null;

onMounted(() => {
    map = L.map("map").setView([51.505, -0.09], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors",
        maxZoom: 18,
    }).addTo(map);
});

onUnmounted(() => {
    map.remove();
});

</script>

<style scoped>
#map {
    height: 100vh;
    width: 100vw;
}
</style>