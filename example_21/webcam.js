"use strict";
define([],function() {

    var getUserMedia = function(t, onsuccess, onerror) {
        var result = undefined;
        if (navigator.getUserMedia) {
            result = navigator.getUserMedia(t, onsuccess, onerror);
        } else if (navigator.webkitGetUserMedia) {
            result = navigator.webkitGetUserMedia(t, onsuccess, onerror);
        } else if (navigator.mozGetUserMedia) {
            result = navigator.mozGetUserMedia(t, onsuccess, onerror);
        } else if (navigator.msGetUserMedia) {
            result = navigator.msGetUserMedia(t, onsuccess, onerror);
        } else {
            onerror(new Error("No getUserMedia implementation found."));
        }
        return result;
    };

    var ready = false;
    var onGetUserMediaSuccess = function(stream) {
        video.src = window.URL.createObjectURL(stream);
        video.play();
        ready = true;
        if( authorizedCallback ) {
            authorizedCallback();
        }
    }

    var authorizedCallback = undefined;
    var waitForAuthorization = function(callback) {
        authorizedCallback = callback;
        if(ready) {
            callback();
        }
    }

    var onGetUserMediaError = function(error) {
        alert("Couldn't access webcam.");
        console.log(error);
    }

    var video = document.createElement('video');
    video.width = 640;
    video.height = 480;
    video.autoplay = true;

    getUserMedia(
        {'video': true},
        onGetUserMediaSuccess,
        onGetUserMediaError
    );
    
    var getDimensions = function() {
        return {
            width:video.width,
            height:video.height
        }
    }

    var copyToContext = function(context) {
        context.drawImage(video, 0, 0);
    }

    return {
        waitForAuthorization: waitForAuthorization,
        copyToContext:copyToContext,
        getDimensions:getDimensions,
    }
}());
