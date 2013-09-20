"use strict";

requirejs( ['webcam','realspace'], function(webcam,realspace) {

    // Initializes components and starts the game loop
    function initialize() {
        // Initialize the AR Display
        realspace.initialize();
    }

    // Runs one iteration of the game loop
    function tick() {
        // Run the AR detector and update the AR display
        realspace.update();

         // Request another iteration of the gameloop
        window.requestAnimationFrame(tick);
    }

    // Start the application once the user gives us authorization.
    webcam.waitForAuthorization( function() {
        initialize();
        tick();
    });
});
