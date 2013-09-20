"use strict";

define(['boxworld', 'boxview'], function( boxworld, boxview ) {

    var world, view = undefined;

    function initialize() {
        world = boxworld.create();

        view = boxview.create( {
            width:640,
            height:480,
            pixelsPerMeter:13
        });

        document.getElementById("flatspace").appendChild( view.canvas );
    }

    function update() {
        world.update();
    }

    return {
        initialize: initialize,
        update: update,
    }
});
