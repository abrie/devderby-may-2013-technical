"use strict";

define([], function() {
    function create() {

        var objects = {};
        var idCount = 0;

        function nextId() {
            return idCount++;
        }

        function registerBody( body ) {
            var id = nextId();
            body.userData = id;

            var object = {
                id:id,
                body:body,
            };

            objects[id] = object;

            return object;
        }

        function getByBody( body ) {
            var id = body.userData;
            return objects[id];
        }

        function getByFixture( fixture ) {
            var body = fixture.GetBody();
            return getByBody( body );
        }

        return {
            getByBody:getByBody,
            getByFixture:getByFixture,
            registerBody:registerBody,
        }
    }

    return {
        create:create
    }
});
