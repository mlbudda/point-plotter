<template>
    <ul>
        <li v-for="(coordinate) in  props.coordinates" :key="coordinate.id">
            <input type="checkbox" :id="coordinate.id" :value="coordinate" v-model="checkedCoordinates"
                :disabled="shouldDisableCheckbox(coordinate.id)" />
            {{ coordinate.lat }}, {{ coordinate.lng }} <button class=" text-red-700"
                @click="removeCoordinate(coordinate.id)">X</button>
        </li>
    </ul>
    <button v-show="props.coordinates.length > 1" @click="removeAllCoordinates()">Clear all</button>
    <p v-if="checkedCoordinates.length > 0">{{ checkedCoordinates }}</p>
    <p v-if="checkedCoordinates.length === 2">Distance: {{ calculateDistanceBetweenSelected }} km</p>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps(['coordinates'])

const checkedCoordinates = ref([]);

const emit = defineEmits(["remove-coordinate", "remove-all-coordinates"]);

const removeCoordinate = (id) => {
    checkedCoordinates.value = checkedCoordinates.value.filter(coord => coord.id !== id);
    emit('remove-coordinate', id);
}

const removeAllCoordinates = () => {
    checkedCoordinates.value = [];
    emit('remove-all-coordinates');
}

// Disable checkbox if there are already two checked
const shouldDisableCheckbox = (id) => {
    const checked = checkedCoordinates.value.some(item => item.id === id)
    return checkedCoordinates.value.length === 2 && !checked;
}

// Add or remove coordinate from checkedCoordinates
function onCheckboxChange(event, id) {
    if (event.target.checked) {
        if (!isChecked(id) && checkedCoordinates.value.length < 2) {
            checkedCoordinates.value.push(id);
        }
    } else {
        const index = checkedCoordinates.value.findIndex(c => c.id === id);
        if (index > -1) {
            checkedCoordinates.value.splice(index, 1);
        }
    }
}

// Calculate distance between two coordinates
function haversineDistance(coord1, coord2) {
    if (!coord1 || !coord2) {
        return 0;
    }
    function toRad(x) {
        return (x * Math.PI) / 180;
    }

    const R = 6371; // Earth's radius in km

    const dLat = toRad(coord2.lat - coord1.lat);
    const dLng = toRad(coord2.lng - coord1.lng);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(coord1.lat)) *
        Math.cos(toRad(coord2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // returns the distance in km
}

const calculateDistanceBetweenSelected = computed(() => {
    if (checkedCoordinates.value.length === 2) {
        const coord1 = checkedCoordinates.value[0];
        const coord2 = checkedCoordinates.value[1];
        return haversineDistance(coord1, coord2).toFixed(2);
    }
    return 0;
});

</script>