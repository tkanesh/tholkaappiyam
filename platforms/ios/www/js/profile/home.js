/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).on("pageshow", "#home", function() {

    var fsMaleTable = [
        [18, 25, 30, 37, 42, 47, 52, 60],
        [26, 35, 30, 35, 40, 43, 49, 56],
        [36, 45, 26, 31, 35, 39, 43, 51],
        [46, 55, 25, 29, 32, 36, 39, 45],
        [56, 65, 22, 26, 30, 32, 36, 41],
        [65, 150, 20, 22, 26, 29, 33, 37]
    ];

    var fsFemaleTable = [
        [18, 25, 28, 33, 38, 42, 47, 56],
        [26, 35, 26, 31, 35, 39, 45, 52],
        [36, 45, 22, 27, 31, 34, 38, 45],
        [46, 55, 20, 25, 28, 31, 34, 40],
        [56, 65, 18, 22, 25, 28, 32, 37],
        [65, 150, 17, 19, 22, 25, 28, 32]
    ];




    var width = $(window).width();
    var prWidth = width - 143;

    $("#panelRight").css("width", prWidth + "px")
    var photo = window.localStorage.getItem("PHOTO");
    var lastname = window.localStorage.getItem("last_name");
    var firstname = window.localStorage.getItem("first_name");
    var buddy = window.localStorage.getItem("BUDDY_BALANCE");
    var height = window.localStorage.getItem("HEIGHT");
    var weight = window.localStorage.getItem("WEIGHT");
    var email = window.localStorage.getItem("email");
    var nickname = window.localStorage.getItem("NICKNAME");
    var gender = window.localStorage.getItem("GENDER");
    var weightLost = window.localStorage.getItem("WeightLostGain");
    var birthday = window.localStorage.getItem("BIRTHDAY");
    var al = window.localStorage.getItem("ACTIVITY_LEVEL");
    var pa = 0;
    var weightGoal = parseFloat(weight) + parseFloat(weightLost);

    var result = calculateBMI(weight, height);
    var resultGoal = calculateBMI(weightGoal, height);

    var bodyFat = calculateBodyFat(weight, height);
    var bodyFatGoal = calculateBodyFat(weightGoal, height);





    switch (al)
    {
        case "S":
            pa = 0;
            break;
        case "L":
            pa = 1;
            break;
        case "A":
            pa = 2;
            break;
        case "V":
            pa = 3;
            break;
        case "E":
            pa = 4;
            break;
    }


    var d = new Date();
    var currYear = d.getFullYear();

    var bd = new Date(birthday);
    var birthYear = bd.getFullYear();

    var age = currYear - birthYear;
    var constAge = gender === "Male" ? 49.9 : 43.27;
    var constAge2 = gender === "Male" ? 0.21 : 0.22;
    var constBMI = gender === "Male" ? 0.36 : 0.37;
    var constPa = gender === "Male" ? 2.12 : 2.17;



    var score = (constAge * age * constAge2) - (result * constBMI) + (pa * constPa);
    var fsTable = gender === "Male" ? fsMaleTable : fsFemaleTable;
    var t1 = "excellent";
    var t2 = "good";
    var t3 = "above average";
    var t4 = "average";
    var t5 = "below average";
    var t6 = "poor";
    var t7 = "ver poor";

    var fType = "";

    for (var i = 0; i < 6; i++) {
        if (age >= fsTable[i][0] && age <= fsTable[i][1]) {
            var vp = 0;//very poor;
            var p = 0;//poor
            var ba = 0;//below average
            var a = 0;//average
            var aa = 0;//above average
            var g = 0;//good


            vp = fsTable[i][2];
            p = fsTable[i][3];
            ba = fsTable[i][4];
            a = fsTable[i][5];
            aa = fsTable[i][6];
            g = fsTable[i][7];

            if (score < vp) {
                fType = t7;
            } else if (score < p) {
                fType = t6;
            } else if (score < ba) {
                fType = t5;
            } else if (score < a) {
                fType = t4;
            } else if (score < aa) {
                fType = t3;
            } else if (score < g) {
                fType = t2;
            } else {
                fType = t1;
            }
            break;
        }

    }


    if (!photo || photo === "null") {
        photo = "../img/noImg.png";

    }

    $("#imgProfile").attr("src", photo);
  var bodyAge= window.localStorage.getItem("BODY_AGE");

  

    $("#lblFS").html(fType);
    $("#lblBodyAge").html(bodyAge);
    
    
    document.getElementById("lblBuddy").innerHTML = buddy;
    document.getElementById("lblName").innerHTML = nickname;
    document.getElementById("lblBmi").innerHTML = result;
    document.getElementById("lblWeight").innerHTML = weight + " kg";

    document.getElementById("lblBodyFat").innerHTML = bodyFat + " %";

    document.getElementById("lblGoalWeight").innerHTML = weightGoal + " kg";
    document.getElementById("lblGoalBmi").innerHTML = resultGoal;
    document.getElementById("lblGoalBodyFat").innerHTML = bodyFatGoal + " %";





});

function logout() {
    window.localStorage.clear();
}

function calculateBMI(weight, height) {
    var result = 0.0;
    result = parseFloat(weight) / ((parseFloat(height) / 100) * (parseFloat(height) / 100));
    result = Math.ceil(result * 10) / 10;

    return result;
}

function calculateBodyFat(weight, height) {
    var gender = window.localStorage.getItem("GENDER");
    var w = parseFloat(weight);
    var h = parseFloat(height);
    var lm = (0.32810 * w) + (0.33929 * h) - 29.5336;
    var lf = (0.29569 * w) + (0.41813 * h) - 43.2933;
    var lbm = gender === "Male" ? lm : lf;

    var bodyFat = Math.round((weight - lbm) / weight * 100);
    return bodyFat;
}