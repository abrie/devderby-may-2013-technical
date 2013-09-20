"use strict";

define(['boxworld'], function(boxworld) {

    var world = undefined;

    function initialize() {
        world = boxworld.create();
    }

    function update() {
        world.update();
    }

    return {
        initialize: initialize,
        update: update,
    }
});
