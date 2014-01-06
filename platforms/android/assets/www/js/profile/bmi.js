/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function bmiTips(type) {
    window.localStorage.setItem("bmiFrom", type);
}
function backBmiTips() {
    var from = window.localStorage.getItem("bmiFrom");
    if (from === "0") {
        $.mobile.changePage("datainput.html");
    } else {
        $.mobile.changePage("bmi.html");
    }
}
function changeWeight() {

    var val = $('#lblWeight').text();
    var change;
    if (val === "kg") {
        change = "lbs";
    } else {
        change = "kg";
    }

    $('#lblWeight').text(change);
    window.localStorage.setItem("currentWeightUnit", change);

}


function changeHeight() {
    var val = $('#lblHeight').text();
    var change;
    if (val === "cm") {
        change = "feet";
    } else {
        change = "cm";
    }

    $('#lblHeight').text(change);
    window.localStorage.setItem("currentHeightUnit", change);

}

function calBMI() {
    var weight = $('#txtWeight').val();
    var height = $('#txtHeight').val();
    var result;

    if (weight !== "" && height !== "") {

        result = parseFloat(weight) / ((parseFloat(height) / 100) * (parseFloat(height) / 100));
        result = Math.ceil(result * 10) / 10;
        var bmi = parseFloat(result);
        $('#txtBMI').val(bmi);
    } else {
        $('#txtBMI').val('N/A');
    }


}

$(document).on("pageshow", "#bmi", function() {

    var height = window.localStorage.getItem("HEIGHT");
    var weight = window.localStorage.getItem("WEIGHT");
    var gender = window.localStorage.getItem("GENDER");
    $.mobile.showPageLoadingMsg();
    var url = ip + "appibuddy/api/rest/next_trial_group.json";
    var group = "";
    $.getJSON(url, function(result) {
        $.each(result, function(keys, vals) {
            $.each(vals, function(key, val) {
                $.each(val, function(k, v) {
                    group = v + "";
                });
            });
        });


        console.log(group);
        $('txtWeight').focus().select();
        {
            result = parseFloat(weight) / ((parseFloat(height) / 100) * (parseFloat(height) / 100));
            result = Math.ceil(result * 10) / 10;
            if (!result) {
                result = 'N/A';
            } else {
                var bmi = parseFloat(result);

                var type = "";

                if (bmi < 15) {
                    type = "Emaciation";
                } else if (bmi < 18.5) {
                    type = "Underweight";
                } else if (bmi < 23) {
                    type = "Normal";
                } else if (bmi < 27.6) {
                    type = "Overweight";
                } else if (bmi < 40) {
                    type = "Obese";
                } else {
                    type = "Morbidly Obese";
                }

                var birthday = window.localStorage.getItem("BIRTHDAY");

                var d = new Date();
                var currYear = d.getFullYear();

                var bd = new Date(birthday);
                var birthYear = bd.getFullYear();

                var age = currYear - birthYear;

                //check next group for new busines logic
                var isTest = 0;
                if ((age >= 21 && age < 65) && (bmi >= 27.4 && bmi <= 37.4)) {
                    if (group === "C" || group === "T") {
                        isTest = 1;
                    }
                }
                
                if (isTest === 1) {
                    $('#joinTest').show();
                    $('#noTest').hide();
                    window.localStorage.setItem("group", group);
                } else {
                    $('#joinTest').hide();
                    $('#noTest').show();
                    window.localStorage.setItem("group", "");
                }

                var fType = "";
                var factor = 0;
                var t1 = "Underweight";
                var t2 = "Healthy";
                var t3 = "Overweight";
                var t4 = "Obese";

                var fat = 0;
                factor = gender === "Male" ? 16.2 : 5.4;
                var fatTable = gender === "Male" ? fatMaleTable : fatFemaleTable;

                fat = (1.2 * bmi) + (0.23 * age) - factor;

                for (var i = 0; i < 16; i++) {
                    if (age >= fatTable[i][0] && age <= fatTable[i][1]) {
                        var u = 0;//underfat
                        var h = 0;//healthy
                        var o = 0;//overfat

                        u = fatTable[i][2];
                        h = fatTable[i][3];
                        o = fatTable[i][4];

                        if (fat <= u) {
                            fType = t1;
                        } else if (fat <= h) {
                            fType = t2;
                        } else if (fat <= o) {
                            fType = t3;
                        } else {
                            fType = t4;
                        }
                        break;
                    }
                }

                var imgsrc = "";
                switch (fType)
                {
                    case t1:
                        imgsrc = "../../img/bmiResult1.png";
                        break;
                    case t2:
                        imgsrc = "../../img/bmiResult2.png";
                        break;
                    case t3:
                        imgsrc = "../../img/bmiResult3.png";
                        document.getElementById("lblAdvice").innerHTML = '"You should do some efford - Follow-us!"<br>';
                        break;
                    case t4:
                        document.getElementById("lblAdvice").innerHTML = '"You should do some efford - Follow-us!"<br>';
                        imgsrc = "../../img/bmiResult4.png";
                        break;

                }
                $("#imgBMI").attr("src", imgsrc);
                document.getElementById("lblFat").innerHTML = fType;
            }

            var w = parseFloat(weight);
            var h = parseFloat(height);
            var lm = (0.32810 * w) + (0.33929 * h) - 29.5336;
            var lf = (0.29569 * w) + (0.41813 * h) - 43.2933;
            var lbm = gender === "Male" ? lm : lf;
            lbm = Math.ceil(lbm * 10) / 10;

            $('#txtBMIResult').val(result);

        }
        $.mobile.hidePageLoadingMsg();
    });
});





