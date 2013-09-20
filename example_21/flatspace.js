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

    var warpholes = {};
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

        warpholes[16] = world.add(
            boxbody.hole,
            {
                x:0,
                y:-8,
                radius:1
            }
        );

        warpholes[16].onContact = function( object ) {
            if( object.is( ball ) ) {
                var isOpen = warpholes[16].isOpen === true;
                console.log("The hole has contacted the ball. isOpen:", isOpen);
            }
        }

        var ball = world.add(
            boxbody.ball,
            {
                x:0,
                y:8,
                radius:1
            }
        );

        ball.onContact = function(object) {
            if( object.is( ground ) ) {
                console.log("The ball has contacted the ground.");
            }
        };
    }

    function setWarpholeState( id, isOpen ) {
        var warphole = warpholes[id];
        if( warphole ) {
            warphole.isOpen = isOpen;
        }
    }

    return {
        initialize: initialize,
        populate: populate,
        update: update,
        setWarpholeState: setWarpholeState,
    }
});
