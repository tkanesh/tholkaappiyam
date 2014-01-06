/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var txtS = '<span style=font-style=14pt><b>Sedentary</b></span><br>Engages in typical daily living activities (shopping, cooking, laundry,';
txtS += 'walking a few minutes to and from car/bus/train but sits much of the day.';
txtS += '<br><b>Occupations</b> e.g. Computer programmers, office and phone jobs.';

var txtL = '<span style=font-style=14pt><b>Low Active</b></span><br>Sedentary activities above plus 30 to 60 minutes of moderate activities eg walks 2 miles at 5km/h';
txtL += '<br><b>Occupations</b> e.g. School teachers, cashiers, retail workers and stay-at-home parents with active children';

var txtA = '<span style=font-style=14pt><b>Active</b></span><br>Sedentary activities above 60- 120 minutes of moderate activities e.g. walks more than 10Km daily';
txtA += '<br><b>Occupation</b> e.g. restaurant servers, light construction workers, cleaning professionals and nursing';

var txtV = '<span style=font-style=14pt><b>Very Activy</b></span><br>Sedentary activities above plus 60 minutes of moderate activities plus 60 minutes of vigorous activity (or 120 minutes or more of moderate activity.';
txtV += '<br><b>Occupations</b> e.g. Heavy construction workers and professional athletes (during their competitive and training sessions)';

var txtEA = '<span style=font-style=14pt><b>EA</b></span><br>Sedentary activities above plus 60 minutes of moderate activities plus 60 minutes of vigorous activity (or 120 minutes or more of moderate activity.';
txtEA += '<br><b>Occupations</b> e.g. Heavy construction workers and professional athletes (during their competitive and training sessions)';

function completeAL(type) {
    var al = window.localStorage.getItem("activity");
    window.localStorage.setItem("ACTIVITY_LEVEL", al);
    if (!al || al === "") {
        alert("Please Select Your Activity.");
    } else {
        // window.localStorage.setItem("activity", "");
        //register();
        var al = window.localStorage.getItem("ACTIVITY_LEVEL");
        console.log(al);
        var profileid = window.localStorage.getItem("profileId");
        var url = ip + "appibuddy/api/rest/PROFILE/" + profileid + ".json";
        $.ajax({type: 'PUT',
            url: url,
            data: {ACTIVITY_LEVEL: al},
            success: function(resp) {
                if (!type) {
                    $.mobile.changePage("bmi.html");

                }else{
                    alert("update successfully");
                }
            }
        });

    }
}


$(document).on("pageshow", "#activityLevel", function() {

    $("#regActivityLevel").submit(function() {
        return false;
    });
    var al = window.localStorage.getItem("ACTIVITY_LEVEL");
    var txt = "";
    if (!(!al || al === "")) {
        $('#div-ar').show();
        $("#choose").hide();
        if (al === "S") {
            txt = txtS;
            $("#imgS").attr("src", "../../img/al_S_selected.png");
        } else if (al === "L") {
            txt = txtL;
            $("#imgLa").attr("src", "../../img/al_la_selected.png");
        } else if (al === "A") {
            txt = txtA;
            $("#imgA").attr("src", "../../img/al_a_selected.png");
        } else if (al === "V") {
            txt = txtV;
            $("#imgVa").attr("src", "../../img/al_va_selected.png");
        } else if (al === "E") {
            txt = txtEA;
            $("#imgEa").attr("src", "../../img/al_ea_selected.png");
        }
        document.getElementById("activityResult").innerHTML = txt;
    }

});
function activityS() {
    $('#div-ar').show();
    $("#choose").hide();
    var txt = txtS;

    window.localStorage.setItem("activity", "S");
    window.localStorage.setItem("activityFactor", "1.2");
    document.getElementById("activityResult").innerHTML = txt;

    $("#imgS").attr("src", "../../img/al_S_selected.png");
    $("#imgLa").attr("src", "../../img/al_la.png");
    $("#imgA").attr("src", "../../img/al_a.png");
    $("#imgVa").attr("src", "../../img/al_va.png");
    $("#imgEa").attr("src", "../../img/al_ea.png");
}
;
function activityL() {

    $('#div-ar').show();
    $("#choose").hide();
    var txt = txtL;

    window.localStorage.setItem("activityFactor", "1.4");
    window.localStorage.setItem("activity", "L");
    document.getElementById("activityResult").innerHTML = txt;

    $("#imgS").attr("src", "../../img/al_S.png");
    $("#imgLa").attr("src", "../../img/al_la_selected.png");
    $("#imgA").attr("src", "../../img/al_a.png");
    $("#imgVa").attr("src", "../../img/al_va.png");
    $("#imgEa").attr("src", "../../img/al_ea.png");
}
;
function activityA() {
    $('#div-ar').show();
    $("#choose").hide();
    var txt = txtA;


    window.localStorage.setItem("activity", "A");

    window.localStorage.setItem("activityFactor", "1.6");
    document.getElementById("activityResult").innerHTML = txt;

    $("#imgS").attr("src", "../../img/al_S.png");
    $("#imgLa").attr("src", "../../img/al_la.png");
    $("#imgA").attr("src", "../../img/al_a_selected.png");
    $("#imgVa").attr("src", "../../img/al_va.png");
    $("#imgEa").attr("src", "../../img/al_ea.png");
}
;

function activityV() {
    $('#div-ar').show();
    $("#choose").hide();
    var txt = txtV;


    window.localStorage.setItem("activity", "V");
    window.localStorage.setItem("activityFactor", "1.7");
    document.getElementById("activityResult").innerHTML = txt;

    $("#imgS").attr("src", "../../img/al_S.png");
    $("#imgLa").attr("src", "../../img/al_la.png");
    $("#imgA").attr("src", "../../img/al_a.png");
    $("#imgVa").attr("src", "../../img/al_va_selected.png");
    $("#imgEa").attr("src", "../../img/al_ea.png");
}
;

function activityEA() {
    $('#div-ar').show();
    $("#choose").hide();
    var txt = txtV;


    window.localStorage.setItem("activity", "E");
    window.localStorage.setItem("activityFactor", "1.8");
    document.getElementById("activityResult").innerHTML = txt;

    $("#imgS").attr("src", "../../img/al_S.png");
    $("#imgLa").attr("src", "../../img/al_la.png");
    $("#imgA").attr("src", "../../img/al_a.png");
    $("#imgVa").attr("src", "../../img/al_va.png");
    $("#imgEa").attr("src", "../../img/al_ea_selected.png");
}
;