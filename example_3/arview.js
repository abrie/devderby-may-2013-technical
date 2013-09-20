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

    var create = function(dimensions, sourceCanvas) {
        // Create a canvas which will be used for WebGL
        var glCanvas = document.createElement('canvas');

        // Initialize the renderer and attach it to the canvas
        var renderer = new THREE.WebGLRenderer({canvas:glCanvas});
        renderer.setSize(dimensions.width, dimensions.height);
        renderer.autoClear = false;

        // Create a reality scene
        var reality = new Reality(sourceCanvas);

        function render() {
            // Render the reality scene
            renderer.render(reality.scene, reality.camera);
        }

        function update() {
            // Notify the reality scene to update it's texture
            reality.update();
        }

        return {
            update: update,
            render: render,
            glCanvas: glCanvas,
        }
    }

    return {
        create: create,
    }

});
