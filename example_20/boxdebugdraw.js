define(['lib/box2d'], function(box2d) {

    function drawAxes( context ) {
        context.strokeStyle = 'rgb(192,0,0)';
        context.beginPath();
        context.moveTo( 0, 0 );
        context.lineTo( 1, 0 );
        context.stroke();
        context.strokeStyle = 'rgb(0,192,0)';
        context.beginPath();
        context.moveTo( 0, 0 );
        context.lineTo( 0, 1 );
        context.stroke();
    }

    function setColorFromDebugDrawCallback( context, color ) {            
        var col = Box2D.wrapPointer( color, Box2D.b2Color );
        var red = (col.get_r() * 255) | 0;
        var green = (col.get_g() * 255) | 0;
        var blue = (col.get_b() * 255) | 0;
        var colStr = red + "," + green + "," + blue;

        context.fillStyle = "rgba(" + colStr + ",0.5)";
        context.strokeStyle = "rgb(" + colStr + ")";
    }

    function drawSegment( context, vert1, vert2 ) {
        var vert1V = Box2D.wrapPointer( vert1, Box2D.b2Vec2 );
        var vert2V = Box2D.wrapPointer( vert2, Box2D.b2Vec2 );                    

        context.beginPath();
        context.moveTo( vert1V.get_x(), vert1V.get_y() );
        context.lineTo( vert2V.get_x(), vert2V.get_y() );
        context.stroke();
    }

    function drawPolygon(context, vertices, vertexCount, fill) {
        context.beginPath();
        for( tmpI=0; tmpI<vertexCount; tmpI++ ) {
            var vert = Box2D.wrapPointer( vertices+(tmpI*8), Box2D.b2Vec2 );
            if ( tmpI == 0 )
                context.moveTo( vert.get_x(), vert.get_y() );
            else
                context.lineTo( vert.get_x(), vert.get_y() );
        }
        context.closePath();
        if (fill)
            context.fill();
        context.stroke();
    }

    function drawCircle( context, center, radius, axis, fill ) {                    
        var centerV = Box2D.wrapPointer( center, Box2D.b2Vec2 );
        var axisV = Box2D.wrapPointer( axis, Box2D.b2Vec2 );
        
        context.beginPath();
        context.arc(
            centerV.get_x(),
            centerV.get_y(),
            radius,
            0,
            2 * Math.PI,
            false 
        );

        if( fill ) {
            context.fill();
        }

        context.stroke();
        
        if( fill ) {
            //render axis marker
            var vert2V = copyVec2( centerV );
            vert2V.op_add( scaledVec2( axisV, radius ) );
            context.beginPath();
            context.moveTo( centerV.get_x(), centerV.get_y() );
            context.lineTo( vert2V.get_x(), vert2V.get_y() );
            context.stroke();
        }
    }

    function drawTransform( context, transform ) {
        var trans = Box2D.wrapPointer( transform, Box2D.b2Transform );
        var pos = trans.get_p();
        var rot = trans.get_q();
        
        context.save();
        context.translate( pos.get_x(), pos.get_y() );
        context.scale( 0.5, 0.5 );
        context.rotate( rot.GetAngle() );
        context.lineWidth *= 2;
        drawAxes( context );
        context.restore();
    }

    //to replace original C++ operator =
    function copyVec2( vec ) {
        return new Box2D.b2Vec2( vec.get_x(), vec.get_y() );
    }

    //to replace original C++ operator *= (float)
    function scaledVec2( vec, scale ) {
        return new Box2D.b2Vec2( scale * vec.get_x(), scale * vec.get_y() );
    }

    var e_shapeBit = 0x0001;
    var e_jointBit = 0x0002;
    var e_aabbBit = 0x0004;
    var e_pairBit = 0x0008;
    var e_centerOfMassBit = 0x0010;

    function create( world, view ) {
        var b2draw = new Box2D.b2Draw();
        b2draw.SetFlags(e_shapeBit | e_centerOfMassBit | e_shapeBit);
        world.getb2world().SetDebugDraw( b2draw );
                
        Box2D.customizeVTable(b2draw, [{
        original: Box2D.b2Draw.prototype.DrawSegment,
        replacement:
            function( ths, vert1, vert2, color ) {                    
                setColorFromDebugDrawCallback( view.context, color );                    
                drawSegment( view.context, vert1, vert2 );
            }
        }]);
        
        Box2D.customizeVTable(b2draw, [{
        original: Box2D.b2Draw.prototype.DrawPolygon,
        replacement:
            function( ths, vertices, vertexCount, color ) {                    
                setColorFromDebugDrawCallback( view.context, color );
                drawPolygon( view.context, vertices, vertexCount, false );                    
            }
        }]);
        
        Box2D.customizeVTable(b2draw, [{
        original: Box2D.b2Draw.prototype.DrawSolidPolygon,
        replacement:
            function( ths, vertices, vertexCount, color ) {                    
                setColorFromDebugDrawCallback( view.context, color );
                drawPolygon( view.context, vertices, vertexCount, true );                    
            }
        }]);
        
        Box2D.customizeVTable(b2draw, [{
        original: Box2D.b2Draw.prototype.DrawCircle,
        replacement:
            function( ths, center, radius, color ) {                    
                setColorFromDebugDrawCallback( view.context, color );
                var dummyAxis = b2Vec2( 0, 0 );
                drawCircle( view.context, center, radius, dummyAxis, false );
            }
        }]);
        
        Box2D.customizeVTable(b2draw, [{
        original: Box2D.b2Draw.prototype.DrawSolidCircle,
        replacement:
            function( ths, center, radius, axis, color ) {                    
                setColorFromDebugDrawCallback( view.context, color );
                drawCircle( view.context, center, radius, axis, true );
            }
        }]);
        
        Box2D.customizeVTable(b2draw, [{
        original: Box2D.b2Draw.prototype.DrawTransform,
        replacement:
            function( ths, transform ) {
                drawTransform( view.context, transform );
            }
        }]);
        
        function render() {
            var origin = view.getOrigin();
            var PTM = view.getPTM();

            view.context.save();            
            view.context.translate( origin.x, origin.y );
            view.context.scale( PTM, -PTM );
            view.context.lineWidth /= PTM;
            view.context.fillStyle = 'rgb(255,255,0)';
            world.getb2world().DrawDebugData();
            view.context.restore();
        }
          
        return {
            render:render
        }
    }

    return {
        create: create,
    }
});
