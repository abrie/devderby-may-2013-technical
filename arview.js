"use strict";

define(["lib/three.min"], function() {

    var Reality = function(sourceCanvas){
        // Create a default camera and scene.
        var camera = new THREE.Camera();
        var scene = new THREE.Scene();

        // Create a plane geometry to hold the sourceCanvas texture
        var geometry = new THREE.PlaneGeometry(2, 2, 0);

        // Create a material textured with the contents of sourceCanvas.
        var texture = new THREE.Texture(sourceCanvas);
        var material = new THREE.MeshBasicMaterial({
               map: texture,
               depthTest: false,
               depthWrite: false
        });

        // Build a mesh and add it to the scene.
        var mesh = new THREE.Mesh( geometry, material );
        scene.add(mesh);

        // We need to notify ThreeJS when the texture has changed.
        function update() {
            texture.needsUpdate = true;
        }

        return {
            camera: camera,
            scene: scene,
            update: update, 
        }
    }

    var Scene = function() {
        var scene = new THREE.Scene();
        var camera = new THREE.Camera();

        function add(object) {
            scene.add(object);
        }

        function remove(object) {
            scene.remove(object);
        }

        function setProjectionMatrix(matrix) {
            camera.projectionMatrix.setFromArray( matrix );
        }

        return {
            scene:scene,
            camera:camera,
            add:add,
            remove:remove,
            setProjectionMatrix:setProjectionMatrix,
        }
    }

    var Reticle = function(scene) {
        // Maintain the state of tracked objects.
        var targets = {};                                             

        // Add a mesh target to be tracked
        function add(mesh, callback) {
            targets[mesh.id] = {
                mesh:mesh,
                isSelected:false,
                callback:callback,
            };
        }

        // Remove a tracked mesh target
        function remove(mesh) {
            var target = targets[mesh.id];

            // If the target is selected, notify that it's now deselected.
            if( target.isSelected ) {
                target.callback(false);
            }

            delete targets[mesh.id];
        }

        // Check a specific target for a ray intersection
        function checkTarget(target) {
            // Center the reticule in the middle of the screen
            var reticule = new THREE.Vector3(0,0,0);

            var projector = new THREE.Projector();
            projector.unprojectVector( reticule, scene.camera );

            var raycaster = new THREE.Raycaster(
                scene.camera.position,
                reticule.sub( scene.camera.position ).normalize()
             );

            var hits = raycaster.intersectObject( target.mesh );
            return(hits.length > 0); 
        }

        // Check all the targets, and notify of changes
        function update() {
            for( var id in targets ) {
                var target = targets[id];
                var state = checkTarget(target);

                // Invoke the callback only if the state has changed
                if( target.isSelected !== state ) {
                    target.callback(state);
                }

                // Update the target selection state
                target.isSelected = state;
            }
        }

        return {
            add:add,
            remove:remove,
            update:update,
        }
    }

    var create = function(dimensions, sourceCanvas) {
        // Create a canvas which will be used for WebGL
        var glCanvas = document.createElement('canvas');

        // Initialize the renderer and attach it to the canvas
        var renderer = new THREE.WebGLRenderer({canvas:glCanvas});
        renderer.setSize(dimensions.width, dimensions.height);
        renderer.autoClear = false;

        // Create a reality scene
        var reality = new Reality(sourceCanvas);

        // Create an augmented scene
        var virtual = new Scene();

        // Create an occluder scene
        var occluder = new Scene();

        var light = new THREE.SpotLight(0xffffff);
        light.position.set(0, 0, 9000);
        light.lookAt( new THREE.Vector3(0,0,0) );
        virtual.scene.add(light);

        // Create a Reticle attached to the virtual scene.
        var reticle = new Reticle(virtual); 

        function render() {
            // Render the reality scene
            renderer.render(reality.scene, reality.camera);

            // Deactivate color buffer renderering, leaving only depth buffer active.
            renderer.context.colorMask(false,false,false,false);

            // Render the occluder scene
            renderer.render( occluder.scene, occluder.camera);

            // Reactivate color buffer rendering
            renderer.context.colorMask(true,true,true,true);

            // Render the augmented components on top of the reality scene.
            renderer.render(virtual.scene, virtual.camera);
        }

        function update() {
            // Notify the reality scene to update it's texture
            reality.update();

            // Check for any reticle target changes
            reticle.update();
        }

        function setCameraMatrix( matrix ) {
            virtual.setProjectionMatrix( matrix );
            occluder.setProjectionMatrix( matrix );
        }

        function add( object, selectionCallback ) {
            virtual.add( object.model );
            occluder.add( object.occluder );
            reticle.add( object.hitbox, selectionCallback);
        }

        function remove( object ) {
            virtual.remove( object.model );
            occluder.remove( object.occluder );
            reticle.remove( object.hitbox );
        }

        return {
            add: add,
            remove: remove,
            update: update,
            render: render,
            glCanvas: glCanvas,
            setCameraMatrix: setCameraMatrix,
        }
    }

    return {
        create: create,
    }

});
