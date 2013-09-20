"use strict";

requirejs( ['webcam','realspace','flatspace'], function( webcam, realspace, flatspace) {

    // Initializes components and starts the game loop
    function initialize() {
        // Initialize the AR Display
        realspace.initialize();
        realspace.setWarpholeStateListener( realspaceWarpholeStateChanged );

        // Initialize the Flat display
        flatspace.initialize();
        flatspace.setBallTransitListener( flatspaceBallTransitedWarphole );

        // Populate the flatspace with objects
        flatspace.populate();
    }

    // Runs one iteration of the game loop
    function tick() {
        // Run the AR detector and update the AR display
        realspace.update();

        // Run a flatspace step and update the display
        flatspace.update();

         // Request another iteration of the gameloop
        window.requestAnimationFrame(tick);
    }

    function realspaceWarpholeStateChanged( id, isOpen ) {
        flatspace.setWarpholeState( id, isOpen );
    }

    function flatspaceBallTransitedWarphole( id ) {
        console.log("ball has transited through flatspace warphole #",id);
    }

    // Start the application once the user gives us authorization.
    webcam.waitForAuthorization( function() {
        initialize();
        tick();
    });
});
