"use strict";

define(['lib/box2d'], function() {

    function create() {
        var gravity = new Box2D.b2Vec2( 0.0, -10.0 );
        var b2world = new Box2D.b2World( gravity );

        function update() {
            b2world.Step( 1/30, 20, 20 );
        }

        return {
            getb2world: function() { return b2world; },
            update:update,
        }
    }

    return {
        create:create
    }
});
