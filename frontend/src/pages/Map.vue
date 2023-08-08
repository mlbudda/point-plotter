<script setup>
import LeafletMap from '../components/LeafletMap.vue';
import MarkersLog from '../components/MarkersLog.vue';
import { ref, onMounted } from 'vue';

const loggedCoordinates = ref([]);
const updateSignal = ref(0);
let idCounter = 0;  // Global counter
const drawPolylineData = ref({})

const handleMapClick = (coords) => {
    const coordinateWithId = { id: idCounter++, ...coords };
    loggedCoordinates.value.push(coordinateWithId);

    // Save the updated coordinates to localStorage
    localStorage.setItem('loggedCoordinates', JSON.stringify(loggedCoordinates.value));

    // // Increment the updateSignal to tell LeafletMap to refresh markers
    updateSignal.value++;
}

const handleRemoveCoordinate = (id) => {
    const index = loggedCoordinates.value.findIndex(coordinate => coordinate.id === id);
    if (index !== -1) {
        loggedCoordinates.value.splice(index, 1);
        // Increment the updateSignal to tell LeafletMap to refresh markers
        updateSignal.value++;
    }
    // Update localStorage with the new list of coordinates
    localStorage.setItem('loggedCoordinates', JSON.stringify(loggedCoordinates.value));
}

const handleRemoveAllCoordinates = () => {
    loggedCoordinates.value = [];
    localStorage.removeItem('loggedCoordinates');
    // // Increment the updateSignal to tell LeafletMap to refresh markers
    updateSignal.value++;
}

function updateSelectedCoordinates(data) {
    drawPolylineData.value = data
}


onMounted(() => {
    // Get the coordinates from localStorage
    const storedCoordsString = localStorage.getItem('loggedCoordinates');

    if (storedCoordsString) {
        // Parse the stored string to convert it back to an array
        const storedCoords = JSON.parse(storedCoordsString);

        // Assign the parsed array to loggedCoordinates
        loggedCoordinates.value = storedCoords;

        // update the idCounter based on the highest id in the storedCoords
        if (storedCoords.length > 0) {
            idCounter = Math.max(...storedCoords.map(coord => coord.id)) + 1;
        }

        // Increment the updateSignal to tell LeafletMap to refresh markers
        updateSignal.value++;
    }
});

</script>
<template>
    <MarkersLog :coordinates="loggedCoordinates" @remove-all-coordinates="handleRemoveAllCoordinates"
        @remove-coordinate="handleRemoveCoordinate" @checked-coordinates="updateSelectedCoordinates"
        @add-new-coordinate="handleMapClick" />
    <LeafletMap @marker-added="handleMapClick" :listOfCoordinates="loggedCoordinates" :updateSignal="updateSignal"
        :drawPolylineData="drawPolylineData" />
</template>

<style>
img.markerhuechange {
    filter: hue-rotate(120deg);
}

.distance-label {
    background-color: white;
    padding: 4px 8px;
    border: 1px solid #333;
    border-radius: 4px;
    text-align: center;
    font-size: 10px;
}
</style>