"use strict";

define([], function() {
    function create() {

        var objects = {};
        var idCount = 0;
        var deletionListeners = [];

        function nextId() {
            return idCount++;
        }

        function registerBody( body ) {
            var id = nextId();
            body.userData = id;

            var object = {
                id:id,
                body:body,
                onContact: undefined,
                isMarkedForDeletion:false,
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

        function addDeletionListener( callback ) {
            deletionListeners.push( callback );
        }

        function notifyDeletionListeners( object ) {
            deletionListeners.forEach( function( listener ) {
                listener( object );
            });
        }

        function processDeletions() {
            for( var id in objects ) {
                var object = objects[id];
                if( object.isMarkedForDeletion ) {
                    notifyDeletionListeners( object );
                    delete objects[id];
                }
            }
        }

        return {
            getByBody:getByBody,
            getByFixture:getByFixture,
            registerBody:registerBody,
            processDeletions:processDeletions,
            addDeletionListener:addDeletionListener,
        }
    }

    return {
        create:create
    }
});
