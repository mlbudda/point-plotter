<template>
    <ul>
        <li v-for="(coordinate, index) in  coordinates " :key="coordinate.id">
            {{ coordinate.lat }}, {{ coordinate.lng }} <button class=" text-red-700"
                @click="removeCoordinate(index)">X</button>
        </li>
        <button v-show="coordinates.length > 1" @click="removeAllCoordinates()">Clear all</button>
    </ul>
</template>

<script setup>
defineProps(['coordinates'])

const emit = defineEmits(["remove-coordinate", "remove-all-coordinates"]);

const removeCoordinate = (index) => {
    emit('remove-coordinate', index);
}

const removeAllCoordinates = () => {
    emit('remove-all-coordinates');
}

</script>