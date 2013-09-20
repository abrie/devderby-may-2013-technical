"use strict";

define([], function() {
    function create( params ) {
        var canvas = document.createElement( 'canvas' );
        canvas.width = params.width;
        canvas.height = params.height;

        var PTM = params.pixelsPerMeter;
        var context = canvas.getContext( '2d' );

        var origin = {
            x:Math.floor( canvas.width/2 ),
            y:Math.floor( canvas.height/2 )
        }

        function pixelToWorld( pixel ) {
            return {                
                x: ( pixel.x - origin.x ) / PTM,
                y: ( canvas.height - pixel.y - origin.y ) / PTM
            }
        }

        function worldToPixel( world ) {
            return {
                x: world.x * PTM + origin.x,
                y: -world.y * PTM + origin.y,
            }
        }

        function metersToPixels( meters ) {
            return meters * PTM;
        }

        function clear() {
            context.fillStyle = 'rgb(0,0,0)';
            context.fillRect( 0, 0, canvas.width, canvas.height );
        }

        return {
            clear:clear,
            canvas:canvas,
            context:context,
            getPTM: function() { return PTM; },
            getOrigin: function() { return origin;  },
            pixelToWorld: pixelToWorld,
            worldToPixel: worldToPixel,
            metersToPixels:metersToPixels,
        }
    }
    
    return {
        create:create
    }
});       
