"use strict";

define(['boxworld', 'boxview', 'boxdebugdraw'], function( boxworld, boxview, boxdebugdraw ) {

    var world, view, debugDraw = undefined;

    function initialize() {
        world = boxworld.create();

        view = boxview.create( {
            width:640,
            height:480,
            pixelsPerMeter:13
        });

        document.getElementById("flatspace").appendChild( view.canvas );

        debugDraw = boxdebugdraw.create( world, view );

    }

    function update() {
        world.update();
        render();
    }

    function render() {
        view.clear();
        debugDraw.render();
    }

    return {
        initialize: initialize,
        update: update,
    }
});
