<script setup>
import LeafletMap from '../components/LeafletMap.vue';
import MarkersLog from '../components/MarkersLog.vue';
import { ref } from 'vue';
import { watch } from 'vue';

const loggedCoordinates = ref([]);
const updateSignal = ref(0);
let idCounter = 0;  // Global counter

const handleMapClick = (coords) => {
    const coordinateWithId = { id: idCounter++, ...coords };
    loggedCoordinates.value.push(coordinateWithId);
}

const handleRemoveCoordinate = (id) => {
    const index = loggedCoordinates.value.findIndex(coordinate => coordinate.id === id);
    if (index !== -1) {
        loggedCoordinates.value.splice(index, 1);
        // Increment the updateSignal to tell LeafletMap to refresh markers
        updateSignal.value++;
    }
}

const handleRemoveAllCoordinates = () => {
    loggedCoordinates.value = [];
    // // Increment the updateSignal to tell LeafletMap to refresh markers
    updateSignal.value++;
}
</script>
<template>
    <MarkersLog :coordinates="loggedCoordinates" @remove-all-coordinates="handleRemoveAllCoordinates"
        @remove-coordinate="handleRemoveCoordinate" />
    <LeafletMap @marker-added="handleMapClick" :listOfCoordinates="loggedCoordinates" :updateSignal="updateSignal" />
</template>

<style>
img.markerhuechange {
    filter: hue-rotate(120deg);
}
</style>