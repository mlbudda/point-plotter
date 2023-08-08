<template>
    <section v-show="props.coordinates.length > 0"
        class=" absolute z-50 top-20 left-3 scr flex flex-col overflow-hidden rounded-sm p-4 shadow-lg shadow-gray-900/5 bg-white">
        <ul class="overflow-y-auto max-h-60 divide-y divide-slate-200">
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
            calculateDistanceBetweenSelected }} km</p>
    </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps(['coordinates'])

const checkedCoordinates = ref([]);

const emit = defineEmits(["remove-coordinate", "remove-all-coordinates", "checked-coordinates"]);

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
        return haversineDistance(coord1, coord2).toFixed(2);
    }
    return 0;
});

watch(calculateDistanceBetweenSelected, (distance) => {
    if (distance > 0) {
        emit('checked-coordinates', { coordPair: checkedCoordinates.value, distance: distance });
    } else {
        emit('checked-coordinates', {});  // Emitting an empty array to signal removal
    }
});

</script>