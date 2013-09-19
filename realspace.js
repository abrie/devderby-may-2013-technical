"use strict";
define(['webcam','ardetector','arview','arobject'], function(webcam,ardetector, arview, arobject) {

    var canvas, context, detector, view = undefined;

    function initialize() {
        canvas = document.createElement('canvas');
        var webcamDimensions = webcam.getDimensions();
        canvas.width = webcamDimensions.width;
        canvas.height = webcamDimensions.height;

        // We need a context for the canvas in order to copy to it.
        context = canvas.getContext('2d');

        // create an AR Marker detector using the canvas as the data source
        detector = ardetector.create( canvas );

        // Create an AR View for displaying the augmented reality scene
        view = arview.create( webcam.getDimensions(), canvas );

        // Set the ARView camera projection matrix according to the detector
        view.setCameraMatrix( detector.getCameraMatrix(10,1000) );

        // Place the arview's GL canvas into the DOM.
        document.getElementById("realspace").appendChild( view.glCanvas );
    }

    function update() {
        // Copy an image from the camara stream onto our canvas
        webcam.copyToContext(context);

        // The ardetector requires that we set a flag when the canvas has changed.
        canvas.changed = true;

        // Ask the detector to make a detection pass.
        detector.detect( onMarkerCreated, onMarkerUpdated, onMarkerDestroyed );

        // Update and render the AR view
        view.update();
        view.render();
    }

    // This function is called when a marker is initally detected on the stream
    function onMarkerCreated(marker) {
        var object = markerObjects[marker.id];
        object.transform( marker.matrix );
        view.add( object, function(isSelected) {
            onMarkerSelectionChanged(marker.id, isSelected);
        });
    }

    // This function is called when an existing marker is repositioned
    function onMarkerUpdated(marker) {
        var object = markerObjects[marker.id];
        object.transform( marker.matrix );
    }

    // This function is called when a marker disappears from the stream.
    function onMarkerDestroyed(marker) {
        var object = markerObjects[marker.id]; 
        view.remove( object );
    }

    // This function is called when a marker object is selected/unselected.
    function onMarkerSelectionChanged(id, isSelected) {
        notifyWarpholeStateChanged( id, isSelected );
    }

    // Create marker objects associated with the desired marker ID.
    var markerObjects = {
        16: arobject.createMarkerObject({color:0xAA0000}), // Marker #16, red.
        32: arobject.createMarkerObject({color:0x00BB00}), // Marker #32, green.
    };

    var warpholeStateListener = undefined;
    function setWarpholeStateListener( callback ) {
        warpholeStateListener = callback;
    }

    function notifyWarpholeStateChanged( id, isOpen ) {
        if( warpholeStateListener ) {
            warpholeStateListener( id, isOpen );
        }
    }

    function addBall() {
        var ball = arobject.createBallObject();
        view.add( ball );
        ball.setPosition(0,0,15);
    }

    return {
        initialize: initialize,
        update: update,
        setWarpholeStateListener:setWarpholeStateListener,
        addBall: addBall,
    }
});
