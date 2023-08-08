<template>
    <section
        class=" absolute z-50 top-40 left-3 scr flex flex-col overflow-hidden rounded-sm p-4 shadow-lg shadow-gray-900/5 bg-white">
        <form @submit.prevent="addCoordinate">
            <input v-model="inputCoordinates" @keyup.enter="addCoordinate"
                class="block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500 sm:text-xs"
                type="text" placeholder="Lat , Lng">
            <span v-if="!isInputValid" class="block text-xs text-red-600">Invalid coordinates format. Please use "Lat ,
                Lng".</span>

            <button type="submit"
                class="w-full inline-flex justify-center rounded-lg py-1 px-3 text-sm font-semibold outline-2 outline-offset-2 transition-color text-green-600 hover:bg-green-200 active:bg-green-400 active:text-white/80 mt-2"
                v-show="inputCoordinates">Add</button>
        </form>
        <ul v-show="props.coordinates.length > 0" class="overflow-y-auto max-h-60 divide-y divide-slate-200">
            <li class="text-xs flex items-center justify-between" v-for="(coordinate) in  props.coordinates"
                :key="coordinate.id">
                <div class="flex items-center">
                    <input type="checkbox" :id="coordinate.id" :value="coordinate" v-model="checkedCoordinates"
                        :disabled="shouldDisableCheckbox(coordinate.id)" />
                    <span class="ml-2">{{ coordinate.lat }}, {{ coordinate.lng }}</span>
                </div>
                <button
                    class="inline-flex justify-center rounded-lg py-1 px-3 text-sm font-semibold outline-2 outline-offset-2 transition-color text-red-600 hover:bg-red-200 active:bg-red-400 active:text-white/80"
                    @click="removeCoordinate(coordinate.id)">-</button>
            </li>
        </ul>
        <button
            class="inline-flex justify-center rounded-lg py-2 px-3 text-sm font-semibold outline-2 outline-offset-2 transition-colors text-black hover:bg-red-200 active:bg-red-400 active:text-white/80 mt-2"
            v-show="props.coordinates.length > 1" @click="removeAllCoordinates()">Clear all</button>
        <p v-if="checkedCoordinates.length === 2" class="mt-2 pt-2 border-t-2 border-slate-100">Distance: {{
            calculateDistanceBetweenSelected }} <button
                class="inline-flex justify-center rounded-lg py-1 px-1 text-sm font-semibold outline-2 outline-offset-2 transition-colors bg-slate-200 text-black hover:bg-slate-200 active:bg-slate-400 active:text-black/80"
                @click="isMetric = !isMetric">{{ isMetric ? "km"
                    : "miles" }}</button></p>
    </section>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

const props = defineProps(['coordinates'])
const checkedCoordinates = ref([]);
const isMetric = ref(true)
const inputCoordinates = ref('')
const isInputValid = ref(true)


const emit = defineEmits(["remove-coordinate", "remove-all-coordinates", "checked-coordinates", "addNewCoordinate"]);

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
        const distanceInKm = haversineDistance(coord1, coord2);
        const milesConvertionRatio = 0.621371;
        // If metric is false, convert to miles, otherwise, return km
        return isMetric.value ? distanceInKm.toFixed(2) : (distanceInKm * milesConvertionRatio).toFixed(2);
    }
    return 0;
});

function validateCoordinates() {
    const trimmedInput = inputCoordinates.value.trim();
    const pattern = /^-?([1-8]?[0-9]\.\d+|90\.0+),\s*-?([1-9]?[0-9]\.\d+|1[0-7][0-9]\.\d+|180\.0+)$/;
    isInputValid.value = pattern.test(trimmedInput);
    inputCoordinates.value = trimmedInput;
}

// Add new coordinate
function addCoordinate() {
    validateCoordinates();
    if (isInputValid.value) {
        const [lat, lng] = inputCoordinates.value.split(',').map(item => item.trim());
        emit('addNewCoordinate', { lat: parseFloat(lat), lng: parseFloat(lng) });
        inputCoordinates.value = '';
    }
}

watch(calculateDistanceBetweenSelected, (distance) => {
    if (distance > 0) {
        emit('checked-coordinates', { coordPair: checkedCoordinates.value, distance: distance });
    } else {
        emit('checked-coordinates', {});  // Emitting an empty array to signal removal
    }
});

// Convert km to miles
watch(isMetric, (value) => {
    if (!value) {
        emit('checked-coordinates', { coordPair: checkedCoordinates.value, distance: calculateDistanceBetweenSelected.value });
        localStorage.setItem('userPrefMetricImperial', JSON.stringify(isMetric.value));
    } else {
        emit('checked-coordinates', { coordPair: checkedCoordinates.value, distance: calculateDistanceBetweenSelected.value });
        localStorage.setItem('userPrefMetricImperial', JSON.stringify(isMetric.value));
    }
})

onMounted(() => {
    // Check if user has a preference for metric or imperial
    const userPrefMetricImperial = JSON.parse(localStorage.getItem('userPrefMetricImperial'));
    if (userPrefMetricImperial !== null) {
        isMetric.value = userPrefMetricImperial;
    }
})

</script>