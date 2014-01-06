/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).on("pageshow", "#stepCounter", function() {

    var options = {frequency: 3000};
    watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);

});

// Stop watching the acceleration
//
function stopWatch() {
    if (watchID) {
        navigator.accelerometer.clearWatch(watchID);
        watchID = null;
    }
}


function onSuccess(acceleration) {
    var element = document.getElementById('accelerometer');
    element.innerHTML = 'Acceleration X: ' + acceleration.x + '<br />' +
            'Acceleration Y: ' + acceleration.y + '<br />' +
            'Acceleration Z: ' + acceleration.z + '<br />' +
            'Timestamp: ' + acceleration.timestamp + '<br />';
}

// onError: Failed to get the acceleration
//
function onError() {
    alert('onError!');
}
