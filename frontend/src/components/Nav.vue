<template>
    <ul
        class="mt-2 z-50 absolute left-1/2 transform -translate-x-1/2 inline-flex rounded-full bg-white/90 px-3 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
        <li><a class="relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400"
                :class="{ 'text-teal-500': currentRoute === '#/about' }" href="#/about">About</a></li>
        <li><a class="relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400"
                :class="{ 'text-teal-500': currentRoute === '#/map' }" href="#/map">Map</a></li>
    </ul>
</template>

<script setup>

defineProps({
    currentRoute: String,
});
</script>