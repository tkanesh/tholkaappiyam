/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

//var ip ="http://localhost:9000/";
//var ip = "http://192.168.1.18:9000/"; //BL
var ip = "http://localhost:9000/";
//var ip = "http://backend.appibuddy.com/";
//var ip = "http://192.168.1.20:9000/";
//var ip = "http://backend.appibuddy.com/";

var fatMaleTable = [
    [7, 7, 13, 20, 25],
    [8, 8, 13, 21, 26],
    [9, 9, 13, 22, 27],
    [10, 10, 13, 23, 28],
    [11, 11, 13, 23, 28],
    [12, 12, 13, 23, 28],
    [13, 13, 12, 22, 27],
    [14, 14, 12, 21, 26],
    [15, 15, 11, 21, 24],
    [16, 16, 10, 20, 24],
    [17, 17, 10, 20, 24],
    [18, 18, 10, 20, 24],
    [19, 19, 9, 20, 24],
    [20, 39, 8, 20, 24],
    [40, 59, 11, 22, 28],
    [60, 79, 13, 25, 30]

];

var fatFemaleTable = [
    [7, 7, 10, 25, 29],
    [8, 8, 10, 26, 30],
    [9, 9, 11, 27, 31],
    [10, 10, 11, 28, 32],
    [11, 11, 11, 29, 33],
    [12, 12, 11, 29, 33],
    [13, 13, 11, 29, 33],
    [14, 14, 11, 30, 34],
    [15, 15, 11, 30, 34],
    [16, 16, 11, 30, 34],
    [17, 17, 11, 30, 35],
    [18, 18, 12, 31, 36],
    [19, 19, 14, 32, 37],
    [20, 39, 21, 33, 39],
    [40, 59, 23, 34, 40],
    [60, 79, 24, 36, 42]

];


$(document).on("swipeleft", "#tut0", function() {
    $.mobile.changePage("tut1.html");
});


$(document).on("swipeleft", "#tut1", function() {
    $.mobile.changePage("tut2.html");
});


$("#imgTut1").swipeleft(function() {
    $.mobile.changePage("tut2.html");
});


$(document).on("swipeleft", "#tut2", function() {
    $.mobile.changePage("tut3.html");
});

$("#imgTut2").swipeleft(function() {
    $.mobile.changePage("tut3.html");
});


$(document).on("swiperight", "#tut2", function() {

    $.mobile.changePage("tut1.html");
});


$("#imgTut2").swiperight(function() {
    $.mobile.changePage("tut1.html");
});


$(document).on("swipeleft", "#tut3", function() {
    $.mobile.changePage("../../main.html");
});

$("#imgTut3").swipeleft(function() {
    $.mobile.changePage("../../main.html");
});


$(document).on("swiperight", "#tut3", function() {

    $.mobile.changePage("tut2.html");
});


$("#imgTut3").swiperight(function() {
    $.mobile.changePage("tut2.html");
});


function alertDismissed() {
    // do something after alertbox
}

function checkMainPage() {

    var first = window.localStorage.getItem("isFirst") + "";

    if (first === "null") {
        $.mobile.changePage("page/tut/tut0.html");
        window.localStorage.setItem("isFirst", "0")
    } else {
        $.mobile.changePage("main.html");
    }


}

function clearStorage(type) {
    var yes = $("#checkFirst").prop("checked");

    if (yes) {
        window.localStorage.clear();
        window.localStorage.setItem("isFirst", "0");
        if (type === 1) {
            $.mobile.changePage("page/profile/index.html");
        } else {
            $.mobile.changePage("page/login.html");
        }

    } else {
        navigator.notification.alert(
                'Please read and agree to the Terms of Agreement', // message
                alertDismissed, // callback
                'Sign In Error', // title
                'OK'                  // buttonName
                );
    }
}



