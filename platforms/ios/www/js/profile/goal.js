
function saveGoal() {
    // $.mobile.changePage("../home.html");
    $.mobile.showPageLoadingMsg();
    var lostgain = $("#txtLostGainWeight").val();
    var progress = $("#selectKg").val();
    var userid = window.localStorage.getItem("userid");

    var d = new Date();

    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();
    var curr_seconds = d.getSeconds();
    var curr_minutes = d.getMinutes();
    var curr_hour = d.getHours();
    var start = curr_year + "-" + curr_month + "-" + curr_date + " ";
    start += curr_hour + ":" + curr_minutes + ":" + curr_seconds;

    var de = new Date();
    de.setMonth(de.getMonth() + 3);

    var end_date = de.getDate();
    var end_month = de.getMonth() + 1; //Months are zero based
    var end_year = de.getFullYear();
    var end_seconds = de.getSeconds();
    var end_minutes = de.getMinutes();
    var end_hour = de.getHours();
    var end = end_year + "-" + end_month + "-" + end_date + " ";
    end += end_hour + ":" + end_minutes + ":" + end_seconds;

    var gl = window.localStorage.getItem("goalGL");

    if (gl === "l") {
        lostgain = 0 - lostgain;
    }

    window.localStorage.setItem("WeightLostGain", lostgain);
    var url = ip + "appibuddy/api/rest/USER_GOAL";


    $.ajax({type: 'POST',
        url: url,
        data: {GOAL_ID: 1, USER_ID: userid, WEIGHT: lostgain, START_DATE: start, END_DATE: end},
        success: function(resp) {
            console.log(resp);
            $.ajax({type: 'POST',
                url: url,
                data: {GOAL_ID: 2, USER_ID: userid, WEIGHT: progress, START_DATE: start, END_DATE: end},
                success: function(resp) {
                    login(2);
                    
                }
            });

        }
    });


}
$(document).on("pageshow", "#goal", function() {
    var birthday = window.localStorage.getItem("BIRTHDAY");

    var d = new Date();
    var currYear = d.getFullYear();

    var bd = new Date(birthday);
    var birthYear = bd.getFullYear();

    var age = currYear - birthYear;
    var gender = window.localStorage.getItem("GENDER");
    var height = window.localStorage.getItem("HEIGHT");
    var weight = window.localStorage.getItem("WEIGHT");
    var idealBodyFat = 0;
    var fatTable = gender === "Male" ? fatMaleTable : fatFemaleTable;
    for (var i = 0; i < 16; i++) {
        if (age >= fatTable[i][0] && age <= fatTable[i][1]) {
            //var idealBodyFatMin = fatTable[i][2];
            //var idealBodyFatMax = fatTable[i][3];

            //   idealBodyFat = (idealBodyFatMin + idealBodyFatMax) / 2;
            idealBodyFat = fatTable[i][3];

        }
    }


    var y = 1 - (idealBodyFat / 100);
    var constW = gender === "Male" ? 0.3281 : 0.29569;
    var constH = gender === "Male" ? 0.33929 : 0.41813;
    var constF = gender === "Male" ? 29.5336 : 43.2933;


    var w = 0;

    w = ((constH * height) - constF) / (y - constW);
    w = Math.ceil(w * 10) / 10;
    $("#txtCurrentWeight").val(weight);
    $("#txtIdealWeight").val(w);

    var diff = parseFloat(w) - parseFloat(weight);
    if (diff < 0) {
        $("#imgSign1").attr("src", "../../img/icon_minus.png");
        $("#imgSign2").attr("src", "../../img/icon_minus.png");
        window.localStorage.setItem("goalGL", "l");
    } else
    {
        $("#imgSign1").attr("src", "../../img/icon_plus.png");
        $("#imgSign2").attr("src", "../../img/icon_plus.png");
        window.localStorage.setItem("goalGL", "g");
    }
    diff = Math.ceil(diff * 10) / 10;
    $("#txtLostGainWeight").val(Math.abs(diff));
});