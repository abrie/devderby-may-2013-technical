"use strict";

define(['boxregistry', 'lib/box2d'], function(boxregistry) {

    function setBeginContactListener( listener, onContact ) {
        Box2D.customizeVTable(listener, [{
            original: Box2D.b2ContactListener.prototype.BeginContact,
            replacement: onContact 
            }]
        );
    }

    function create() {
        var gravity = new Box2D.b2Vec2( 0.0, -10.0 );
        var b2world = new Box2D.b2World( gravity );
        var objects = boxregistry.create();

        objects.addDeletionListener( function( object ) {
            if( object.body ) {
                b2world.DestroyBody( object.body );
            }
        });

        function update() {
            b2world.Step( 1/30, 20, 20 );
            objects.processDeletions();
        }

        function add( bodyFunc, params ) {
            var body = bodyFunc( b2world, params );
            return body;
        }

        var listener = new Box2D.b2ContactListener();
        b2world.SetContactListener( listener );

        function onBeginContact( thsPtr, contactPtr ) {
            console.log('contact');
            var contacts = Box2D.wrapPointer( contactPtr, Box2D.b2Contact );

            var fixtureA = contacts.GetFixtureA();
            var fixtureB = contacts.GetFixtureB();

            var objectA = objects.getByFixture( fixtureA );
            var objectB = objects.getByFixture( fixtureB );

            if( objectA.isMarkedForDeletion ||
                objectB.isMarkedForDeletion ) {
                return;
            }

            if( objectA.onContact ) {
                objectA.onContact( objectB );
            }

            if( objectB.onContact ) {
                objectB.onContact( objectA );
            }
        }

        setBeginContactListener( listener, onBeginContact );

        return {
            getb2world: function() { return b2world; },
            update:update,
            add:add,
        }
    }


    return {
        create:create
    }
});
