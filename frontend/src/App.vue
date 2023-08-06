<script setup>
import { ref, computed } from 'vue';

import About from "./pages/About.vue";
import Map from "./pages/Map.vue";
import Nav from "./components/Nav.vue";

const routes = {
  "#/about": About,
  "#/map": Map,
};

// Create a reactive reference to the current route
const currentRoute = ref(window.location.hash);


if (!currentRoute.value || currentRoute.value === "#/") {
  window.location.hash = "#/about";
}

// Listen for changes to the URL hash value
window.addEventListener("hashchange", () => {
  currentRoute.value = window.location.hash;
});

const currentView = computed(() => {
  // If the route doesn't match any defined route, default to About.
  return routes[currentRoute.value] || About;
});

</script>

<template>
  <div class="relative">
    <Nav :currentRoute="currentRoute" />
    <component :is="currentView" />
  </div>
</template>

<style scoped></style>