"use strict";

requirejs([], function() {

    // Initializes components and starts the game loop
    function initialize() {
    }

    // Runs one iteration of the game loop
    function tick() {
        // Request another iteration of the gameloop
        window.requestAnimationFrame(tick);
    }

    // Start the application
    initialize();
    tick();
});
