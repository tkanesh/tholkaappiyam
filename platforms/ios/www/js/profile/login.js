/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).on("pageshow", "#loginAccount", function() {

    $("#loginAccountForm").validate();

});




function login(type) {

    var isLogin = $("#isLogin").val();
    var email = "";
    var pass = "";

    if (!isLogin) {
        $("#loginAccountForm").submit(function() {
            return false;
        });
        email = $("#txtLoginEmail").val();
        pass = $("#txtLoginPassword").val();
        $.mobile.showPageLoadingMsg();

    } else {
        email = $("#txtEmail").val();
        pass = $("#txtPassword").val();
    }

    if (type === 2) {
        email = window.localStorage.getItem("email");
        pass = window.localStorage.getItem("pass");
    }

    var error = 1;
    var atpos = email.indexOf("@");
    var dotpos = email.lastIndexOf(".");
    if (!(atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= email.length)) {
        error = 0;
    }

    if (email.length >= 5 && pass.length >= 6 && error === 0) {

        data = "email=" + email + "&passwd=" + pass;
        var url = ip + "appibuddy/api/call/run/logon";
        $.getJSON(url + "?callback=?&", data, function(result) {

            if (result === false) {
                navigator.notification.alert(
                        'Please Type Your Password Again', // message
                        alertDismissed, // callback
                        'Wrong Password!', // title
                        'OK'                  // buttonName
                        );
                $.mobile.hidePageLoadingMsg();

            } else
            {
                $.each(result, function(keys, vals) {
                    window.localStorage.setItem(keys, vals);

                });
                var profileid = window.localStorage.getItem("profileId");
                var userid = window.localStorage.getItem("userid");

                console.log(profileid);
                console.log(userid);

                var stage = 0;
                var url = ip + "appibuddy/api/rest/profile_progress/" + userid + "/" + profileid + ".json";

                $.getJSON(url, function(result) {
                    $.each(result, function(key, val) {
                        //progress
                        //stage
                        if (key === "stage") {
                            stage = val;
                        }

                        if (key === "content") {
                            $.each(val, function(ke, va) { //getStage

                                if (va) {
                                    if (va.length > 0) {//getStagedata stage:[]

                                        $.each(va, function(k, v) {
                                            var tempKey = "";
                                            var tempItem = "";

                                            var tempId = "";
                                            var tempValue = "";
                                            $.each(v, function(a, b) {//getStage stage:[{}]

                                                if (ke === "stage3" || ke === "stage4") {

                                                    if (a === "RESULTS") {
                                                        tempItem = b;
                                                    } else if (a === "id") {
                                                        tempValue = b;
                                                    }
                                                }

                                                if (ke === "stage5") {
                                                    if (a === "SCR_VARIABLE") {
                                                        tempKey = b;
                                                    } else if (a === "SCR_VALUE") {

                                                        tempItem = b;
                                                    }
                                                }

                                                if (ke === "stage1" || ke === "stage2" || ke === "stage7") { //stage1, stage2,stage7
                                                    $.each(b, function(m, j) {//getStage stage"[{0},{1}]

                                                        if (ke === "stage2") {
                                                            if (m === "KEYWORD") {
                                                                tempKey = j;
                                                            } else {
                                                                tempItem += "|||||" + m + "=>" + j;
                                                            }
                                                        }

                                                        if (ke === "stage7") {
                                                            if (m === "NAME") {
                                                                tempKey = j;
                                                            } else if (m === "WEIGHT") {
                                                                tempItem = j;
                                                            } else if (m === "id") {

                                                                tempValue = j;
                                                            }
                                                        }


                                                        if (ke === "stage1") {
                                                            window.localStorage.setItem(m, j);
                                                        }

                                                    });
                                                }
                                            });

                                            if (ke === "stage2") {
                                                window.localStorage.setItem(tempKey, tempItem);
                                            }

                                            if (ke === "stage3") {
                                                tempKey = "INSULIN";
                                                tempId = "INSULIN_ID";
                                                window.localStorage.setItem(tempKey, tempItem);
                                                window.localStorage.setItem(tempId, tempValue);
                                            }

                                            if (ke === "stage4") {
                                                tempKey = "TFEQ";
                                                tempId = "TFEQ_ID";
                                                window.localStorage.setItem(tempKey, tempItem);
                                                window.localStorage.setItem(tempId, tempValue);
                                            }

                                            if (ke === "stage5") {
                                                window.localStorage.setItem(tempKey, tempItem);
                                            }

                                            if (ke === "stage7") {

                                                window.localStorage.setItem(tempKey, tempItem);
                                                tempId = tempKey + "_ID";
                                                window.localStorage.setItem(tempId, tempValue);
                                                
                                                console.log(tempId+"::"+tempValue);
                                            }

                                        });
                                    }
                                }
                            });
                        }
                    });

                    var path = ""

                    if (!type) {
                        path = "";

                    } else {
                        path = "../";
                    }

                    switch (stage)
                    {
                        case 0:
                            path += "home.html";
                            break;
                        case 1:
                            path += "profile/profile.html";
                            break;
                        case 2:
                            path += "profile/medicalHistory.html";
                            break;
                        case 3:
                            path += "profile/insulin.html";
                            break;
                        case 4:
                            path += "profile/tfeq.html";
                            break;
                        case 5:
                            path += "profile/datainput.html";
                            break;
                        case 6:
                            path += "profile/activityLeve.html";
                            break;
                        case 7:
                            path += "profile/goal.html";
                            break;
                    }


                    //Enerygy
                    var weight = window.localStorage.getItem("WEIGHT");
                    var height = window.localStorage.getItem("HEIGHT");
                    var al = window.localStorage.getItem("ACTIVITY_LEVEL");
                    var birthday = window.localStorage.getItem("BIRTHDAY")
                    var gender = window.localStorage.getItem("GENDER");

                    window.localStorage.setItem("activity", al);

                    var d = new Date();
                    var currYear = d.getFullYear();

                    var bd = new Date(birthday);
                    var birthYear = bd.getFullYear();

                    var age = currYear - birthYear;


                    var const1 = gender === "Male" ? 13.75 : 9.56;
                    var const2 = gender === "Male" ? 5 : 1.85;
                    var const3 = gender === "Male" ? 6.76 : 4.68;
                    var const4 = gender === "Male" ? 66 : 655;

                    var e = (const1 * weight) + (height * const2) - (const3 * age) + const4;

                    var alconst = 1;
                    switch (al)
                    {
                        case "S":
                            alconst = 1.2;
                            break;
                        case "L":
                            alconst = 1.4;
                            break;
                        case "A":
                            alconst = 1.6;
                            break;
                        case "V":
                            alconst = 1.7;
                            break;
                        case "E":
                            alconst = 1.9;
                            break;

                    }

                    var energy = e * alconst;


                    energy = Math.round(energy);

                    window.localStorage.setItem("energyNeed", energy);

                    var bodyAge = "";
                    var url = ip + "appibuddy/api/rest/body_age/" + userid + ".json";
                    $.ajax({
                        url: url,
                        dataType: 'json',
                        async: false,
                        success: function(result) {
                            $.each(result, function(key, val) {
                                $.each(val, function(ke, va) {
                                    bodyAge = va;
                                })

                            })
                        }
                    });


                    window.localStorage.setItem("BODY_AGE", bodyAge);


                    $.mobile.changePage(path);

                });
            }

        });
    } else {
        $.mobile.hidePageLoadingMsg();

    }

}



