"use strict";

define(['boxworld', 'boxview', 'boxdebugdraw', 'boxbody'], function( boxworld, boxview, boxdebugdraw, boxbody ) {

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

    function populate() {
        var ground = world.add(
            boxbody.edge,
            {
                x:0,
                y:-15,
                width:20,
                height:0,
            }
        );

        var ball = world.add(
            boxbody.ball,
            {
                x:0,
                y:8,
                radius:1
            }
        );

        ball.onContact = function(object) {
            console.log("The ball has contacted:", object);
            if( object.is( ground ) ) {
                ball.isMarkedForDeletion = true;
            }
        };
    }

    return {
        initialize: initialize,
        populate: populate,
        update: update,
    }
});
