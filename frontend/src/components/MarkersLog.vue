<template>
    <ul>
        <li v-for="(coordinate, index) in  coordinates " :key="coordinate.id">
            <input type="checkbox" :id="coordinate.id" :value="coordinate.id" :checked="isChecked(coordinate.id)"
                :disabled="shouldDisableCheckbox(index)" @change="onCheckboxChange($event, index)" />
            {{ coordinate.lat }}, {{ coordinate.lng }} <button class=" text-red-700"
                @click="removeCoordinate(index)">X</button>
        </li>
    </ul>
    <button v-show="coordinates.length > 1" @click="removeAllCoordinates()">Clear all</button>
    <p v-if="checkedCoordinates.length > 0">{{ checkedCoordinates }}</p>
</template>

<script setup>
import { ref } from 'vue';
defineProps(['coordinates'])

const checkedCoordinates = ref([]);

const emit = defineEmits(["remove-coordinate", "remove-all-coordinates"]);

const removeCoordinate = (index) => {
    emit('remove-coordinate', index);
}

const removeAllCoordinates = () => {
    emit('remove-all-coordinates');
}

// Check if id is in checkedCoordinates
function isChecked(id) {
    return checkedCoordinates.value.includes(id);
}

// Disable checkbox if there are already two checked 
const shouldDisableCheckbox = (id) => {
    return checkedCoordinates.value.length === 2 && !checkedCoordinates.value.includes(id);
}

// Add or remove id from checkedCoordinates
function onCheckboxChange(event, id) {
    if (event.target.checked) {
        if (!isChecked(id) && checkedCoordinates.value.length < 2) {
            checkedCoordinates.value.push(id);
        }
    } else {
        const index = checkedCoordinates.value.indexOf(id);
        if (index > -1) {
            checkedCoordinates.value.splice(index, 1);
        }
    }
}

</script>