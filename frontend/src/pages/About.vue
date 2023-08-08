<template>
    <div class="max-w-3xl mx-auto px-4 md:px-20 pt-20 space-y-6">
        <h1 class="text-3xl font-semibold mb-2 leading-loose">Point Plotter</h1>
        <p class="text-lg leading-relaxed mb-4">Point Plotter is a two-page application that allows users to interact with a
            fullscreen map, add coordinates or points to the map, and calculate the distance between these points.</p>

        <h2 class="text-2xl font-semibold mb-2 leading-loose">Features</h2>

        <h3 class="text-xl font-semibold mb-2 leading-loose">Core Functionality</h3>
        <ul class="space-y-4 divide-y divide-slate-200">
            <li class=" py-2">Two Page App: Navigate easily between the two main pages:
                About and Map.</li>
            <li class="py-2">Fullscreen Map Leaflet: Enjoy a seamless and fully
                immersive mapping experience.</li>
            <li class=" py-2">Navigation Button Group: Quickly switch between the About
                and Map pages using the navigation buttons at the top.</li>
            <li class=" py-2">Map Points List Popup: Access the list of plotted points
                on the map in a popup on the left.</li>
            <li class="py-2">Calculated Distance Window: View the calculated distance
                between points in kilometers, with the option to convert to miles.</li>
            <li class="py-2">Clear Points: Clear individual points or clear all at
                once for a fresh start.</li>
            <li class="py-2">Store History in browsers LocalStorage: Keep track of
                your past actions for a more personalized experience.</li>
            <li class=" py-2">Enter Coordinates: Input specific coordinates manually.
            </li>
        </ul>
    </div>
</template>
