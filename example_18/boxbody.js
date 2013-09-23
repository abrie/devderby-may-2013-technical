"use strict";

define(['lib/box2d'], function() {

    var ball = function( b2world, params ) {
        var shape = new Box2D.b2CircleShape();
        shape.set_m_radius(params.radius); 

        var fixtureDef = new Box2D.b2FixtureDef();
        fixtureDef.set_shape( shape );
        fixtureDef.set_restitution( 0.5 );
        fixtureDef.set_density( 1.0 );

        var bodyDef = new Box2D.b2BodyDef();
        bodyDef.set_bullet( true );
        bodyDef.set_type( Box2D.b2_dynamicBody );
        bodyDef.set_position( new Box2D.b2Vec2( params.x, params.y ) );

        var body = b2world.CreateBody( bodyDef );

        var fixture = body.CreateFixture( fixtureDef );

        return body;
    }

    var edge = function( b2world, params ) {
        var bodyDef = new Box2D.b2BodyDef();
        bodyDef.set_position( new Box2D.b2Vec2( params.x, params.y ) );
        var body = b2world.CreateBody( bodyDef );

        var shape = new Box2D.b2EdgeShape();
        shape.Set(
            new Box2D.b2Vec2( -params.width/2, params.height/2 ),
            new Box2D.b2Vec2( params.width/2, -params.height/2 )
        );

        var fixture = body.CreateFixture( shape, 0.0 );

        return body;
    }

    return {
        ball:ball,
        edge:edge,
    }

});