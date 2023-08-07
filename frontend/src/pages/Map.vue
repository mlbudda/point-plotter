<script setup>
import LeafletMap from '../components/LeafletMap.vue';
import MarkersLog from '../components/MarkersLog.vue';
import { ref } from 'vue';
import { watch } from 'vue';

const loggedCoordinates = ref([]);
const updateSignal = ref(0);

const handleMapClick = (coords) => {
    loggedCoordinates.value.push(coords);
    console.log(loggedCoordinates.value);
}

const handleRemoveCoordinate = (index) => {
    loggedCoordinates.value.splice(index, 1);
    // Increment the updateSignal to tell LeafletMap to refresh markers
    updateSignal.value++;
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