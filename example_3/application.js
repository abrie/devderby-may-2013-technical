"use strict";

requirejs( ['webcam','ardetector','arview'], function(webcam,ardetector,arview) {

    var canvas, context, detector, view = undefined;

    // Initializes components and starts the game loop
    function initialize() {
        // Create a canvas element to which we will copy video.
        canvas = document.createElement('canvas');
        var webcamDimensions = webcam.getDimensions();
        canvas.width = webcamDimensions.width;
        canvas.height = webcamDimensions.height;

        // We need a context for the canvas in order to copy to it.
        context = canvas.getContext('2d');

        // Create an AR View for displaying the augmented reality scene
        view = arview.create( webcam.getDimensions(), canvas );

        // Place the arview's GL canvas into the DOM.
        document.getElementById("application").appendChild( view.glCanvas );

        // create an AR Marker detector using the canvas as the data source
        detector = ardetector.create( canvas );
    }

    // Runs one iteration of the game loop
    function tick() {
        // Copy an image from the camara stream onto our canvas
        webcam.copyToContext(context);

        // The ardetector requires that we set a flag when the canvas has changed.
        canvas.changed = true;

        // Ask the detector to make a detection pass.
        detector.detect( onMarkerCreated, onMarkerUpdated, onMarkerDestroyed );

        // Update and render the AR view
        view.update();
        view.render();

        // Request another iteration of the gameloop
        window.requestAnimationFrame(tick);
    }

    // Start the application once the user gives us authorization.
    webcam.waitForAuthorization( function() {
        initialize();
        tick();
    });

    // This function is called when a marker is initally detected on the stream
    function onMarkerCreated(marker) {
        console.log("Marker created:", marker.id);
    }

    // This function is called when an existing marker is repositioned
    function onMarkerUpdated(marker) {
        console.log("Marker updated:", marker.id);
    }

    // This function is called when a marker disappears from the stream.
    function onMarkerDestroyed(marker) {
        console.log("Marker deleted:", marker.id);
    }

});
