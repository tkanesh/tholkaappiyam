/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
////////////////Start Basic account
$(document).on("pageshow", "#registerAccount", function() {

    $.validator.addMethod("uniEmail", function(value, element) {
        var emailE = window.localStorage.getItem("emailE");

        return value !== emailE && value !== "";
    }, 'Existing email');

    $("#regAccForm").validate();
    var email = window.localStorage.getItem("email");

    var pass = window.localStorage.getItem("pass");
    var rePass = window.localStorage.getItem("rePass");

    $("#txtEmail").val(email);
    $("#txtPassword").val(pass);
    $("#txtRePassword").val(rePass);

});

function checkEmail() {
    var email = $("#txtEmail").val();
    var atpos = email.indexOf("@");
    var dotpos = email.lastIndexOf(".");

    if (!(atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= email.length)) {
        url = ip + "appibuddy/api/rest/email/" + email + ".json";

        $.getJSON(url, function(data) {
            $.each(data, function(key, val) {
                if (JSON.stringify(val).length > 2) {
                    document.getElementById("lblTitle").innerHTML = "Account Login";

                    $('#isLogin').val("1");
                    $('#rePass').hide();
                } else {
                    document.getElementById("lblTitle").innerHTML = "Account Registration";
                    $('#rePass').show();
                    $('#isLogin').val("0");
                }
            });
        });
    } else {
        document.getElementById("lblTitle").innerHTML = "Account Registration";
        $('#rePass').show();
        $('#isLogin').val("0");
    }

}

function saveAccountOne() {

    $("#registerAccount").submit(function() {
        return false;
    });

    $.mobile.showPageLoadingMsg();
    //var mobile = $("#txtMobile").val();
    var email = $("#txtEmail").val();
    var pass = $("#txtPassword").val();
    var rePass = $("#txtRePassword").val();
    var isLogin = $("#isLogin").val();

    // window.localStorage.setItem("mobile", mobile);
    window.localStorage.setItem("email", email);
    window.localStorage.setItem("pass", pass);
    if (isLogin === "0") {
        window.localStorage.setItem("rePass", rePass);
        var error = 0;

        if (pass === "" || rePass === "" || email === "" || pass !== rePass || pass.length < 6) { //mobile ===""
            error = 1;
        }
        var atpos = email.indexOf("@");
        var dotpos = email.lastIndexOf(".");
        if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= email.length) {
            error = 1;
        }


        var emailE = window.localStorage.getItem("emailE");
        if (email === emailE || email.length < 5) {
            error = 1;
        }

        //could be deleted but ..if the connection speed is slow, this could make sure the mobile is exits
        url = ip + "appibuddy/api/rest/email/" + email + ".json";

        $.getJSON(url, function(data) {
            $.each(data, function(key, val) {
                if (JSON.stringify(val).length > 2) {
                    window.localStorage.setItem("emailE", email);
                    navigator.notification.alert(
                            'The Email has been registered!', // message
                            alertDismissed, // callback
                            'Existing Email!', // title
                            'OK'                  // buttonName
                            );

                    error = 1;
                } else {
                    if (error === 0) {
                        $.mobile.hidePageLoadingMsg();
                        $.mobile.changePage("account.html");
                    } else {

                        $.mobile.hidePageLoadingMsg();
                    }
                }
            });
        });

    } else {
        if (pass === "" || email === "" || pass.length < 6) { //mobile ===""
            error = 1;
        }
        var atpos = email.indexOf("@");
        var dotpos = email.lastIndexOf(".");
        if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= email.length) {
            error = 1;
        }

        if (error === 1) {
            $.mobile.hidePageLoadingMsg();
        }
        login(1);
    }
}


/////////////////////End Basic Account

//////////////////// Start  Register mobile no
$(document).on("pageshow", "#registerAccountEA", function() {
    $.validator.addMethod("uniMobile", function(value, element) {
        var mobileE = window.localStorage.getItem("mobileE");

        return value !== mobileE && value !== "";
    }, 'Existing Mobile');

    $("#regAccFormEA").validate();
});

function checkMobile() {
    var mobile = $("#txtMobile").val();

    if (mobile.length > 7) {

        url = ip + "appibuddy/api/rest/mobile/" + mobile + ".json";

        $.getJSON(url, function(data) {
            $.each(data, function(key, val) {
                if (JSON.stringify(val).length > 2) {
                    window.localStorage.setItem("mobileE", mobile);
                    if (mobile !== "") {
                        navigator.notification.alert(
                                'The mobile no has been registered!', // message
                                alertDismissed, // callback
                                'Existing Mobile!', // title
                                'OK'                  // buttonName
                                );
                    }
                }
            });
        });
    }
}

function saveAccountTwo() {

    $("#registerAccountEA").submit(function() {
        return false;
    });

    $.mobile.showPageLoadingMsg();
    var mobile = $("#txtMobile").val();
    var vcode = $("#txtCode").val();
    mobile = mobile.replace(/\s+/g, '');

    var error = 0;

    if (mobile === "" || vcode === "" || vcode.length < 6) {
        error = 1;
    }

    if (vcode !== window.localStorage.getItem("otp") && vcode !== "0000000") {
        error = 1;
        navigator.notification.alert(
                "OTP is invalid. Please try again.", // message
                alertDismissed, // callback
                'OTP Error!', // title
                'OK'                  // buttonName
                );
    }

    if (error === 0) {

        window.localStorage.setItem("MOBILE", mobile);
        var pass = window.localStorage.getItem("pass");
        var email = window.localStorage.getItem("email");

        data = "mobile=" + mobile
                + "&email=" + email
                + "&password=" + pass;


        var url = ip + "appibuddy/api/call/run/preregister";
        $.getJSON(url + "?callback=?&", data, function(result) {
            var profileid = "";
            var userid = "";
            $.each(result, function(key, val) {
                if (key === "profileid") {
                    profileid = val;
                }
                if (key === "userid") {
                    userid = val;
                }
            });


            if (profileid > 0) {
                window.localStorage.setItem("profileId", profileid);
                window.localStorage.setItem("userid", userid);

                console.log("profileid" + profileid);
                console.log("userid" + userid);
            }
        });

        $.mobile.changePage("profile.html");
    } else {
        $.mobile.hidePageLoadingMsg();
    }
}

function RequestOTP() {

    var mobile = $("#txtMobile").val();
    var vcode = $("#txtCode").val();

    mobile = mobile.replace(/\s+/g, '');

    var mobileE = window.localStorage.getItem("mobileE");
    if (mobile.length < 8 || mobile === mobileE) {
        error = 1;
    }
    $('#btnOtpSend').addClass('ui-disabled');

    url = ip + "appibuddy/api/call/run/sendotp";
    data = "mobile=" + mobile;
    $.getJSON(url + "?callback=?", data, function(data) {
        var otp = 0;
        var sent = "";
        var resp = "";
        $.each(data, function(key, val) {
            if (key === "otp") {
                console.log(val);
                otp = val.valueOf();
                window.localStorage.setItem("otp", otp);
            }
            else if (key === "sent")
                sent = val + "";
            else if (key === "resp")
                resp = val;
        });

        var msg = "";
        if (sent === "true") {
            msg = "One Time Password has been sent.";
            var sec = 15;
            var timer = setInterval(function() {
                document.getElementById("lblOtpSend").innerHTML = "Send (" + sec-- + ")";

                if (sec === -1) {
                    $('#btnOtpSend').removeClass('ui-disabled');
                    document.getElementById("lblOtpSend").innerHTML = "Send";
                    clearInterval(timer);
                }
            }, 1000);
        } else {
            msg = "Your mobile number is invalid. ";
            document.getElementById("lblOtpSend").innerHTML = "Send";
            $('#btnOtpSend').removeClass('ui-disabled');
        }
        navigator.notification.alert(
                msg, // message
                alertDismissed, // callback
                'OTP Sent!', // title
                'OK'                  // buttonName
                );
    });
}
////////////////End Register Mobile

///////////////Start Profile Details
$(document).on("pageshow", "#registerProfile", function() {

    $("#regProForm").validate();
    $("#takePictureField").on("change", gotPic);

    desiredWidth = window.innerWidth;
    if (!("url" in window) && ("webkitURL" in window)) {
        window.URL = window.webkitURL;
    }

    var nickname = window.localStorage.getItem("NICKNAME");
    var lastname = window.localStorage.getItem("last_name");
    var firstname = window.localStorage.getItem("first_name");
    var gender = window.localStorage.getItem("GENDER");
    var ms = window.localStorage.getItem("MARITAL_STATUS");
    var birthday = window.localStorage.getItem("BIRTHDAY");
    var language = window.localStorage.getItem("PREFERED_LANG");
    var food = window.localStorage.getItem("PREFERED_FOOD");
    var obj = window.localStorage.getItem("PHOTO");

    $("#txtLastName").val(lastname);
    $("#txtFirstName").val(firstname);
    $("#txtNick").val(nickname);

    $("#selectGender").val(gender).selectmenu('refresh');
    $("#selectMS").val(ms).selectmenu('refresh');
    $("#selectLanguage").val(language).selectmenu('refresh');
    $("#selectFood").val(food).selectmenu('refresh');
    $("#txtBirthday").val(birthday);

    if (obj !== "" && obj) {
        $("#yourimage").attr("src", obj);
    }
});

function saveProfile() {
    var nickname = $("#txtNick").val();
    var firstname = $("#txtFirstName").val();
    var lastname = $("#txtLastName").val();
    var gender = $("#selectGender").val();
    var ms = $("#selectMS").val();
    var birthday = $("#txtBirthday").val();
    var language = $("#selectLanguage").val();
    var food = $("#selectFood").val();

    window.localStorage.setItem("isAgree", "0");
    window.localStorage.setItem("group", "R");
    window.localStorage.setItem("last_name", lastname);
    window.localStorage.setItem("first_name", firstname);
    window.localStorage.setItem("GENDER", gender);
    window.localStorage.setItem("MARITAL_STATUS", ms);
    window.localStorage.setItem("BIRTHDAY", birthday);
    window.localStorage.setItem("NICKNAME", nickname);
    window.localStorage.setItem("PREFERED_LANG", language);
    window.localStorage.setItem("PREFERED_FOOD", food);

}


function saveProfileServer() {
    $.mobile.showPageLoadingMsg();
    saveProfile();

    var profileid = window.localStorage.getItem("profileId");
    var userid = window.localStorage.getItem("userid");

    var lastname = window.localStorage.getItem("last_name");
    var firstname = window.localStorage.getItem("first_name");
    var gender = window.localStorage.getItem("GENDER");
    var birthday = window.localStorage.getItem("BIRTHDAY");
    var nickname = window.localStorage.getItem("NICKNAME");
    var language = window.localStorage.getItem("PREFERED_LANG");
    var food = window.localStorage.getItem("PREFERED_FOOD");
    var photo = window.localStorage.getItem("PHOTO");
    var ms = window.localStorage.getItem("MARITAL_STATUS");


    url = ip + "appibuddy/api/rest/PROFILE/" + profileid + ".json";


    if (lastname === "" || firstname === "" || birthday === "" || nickname === "") {
        $.mobile.hidePageLoadingMsg();
        return;
    }

    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();
    var curr_seconds = d.getSeconds();
    var curr_minutes = d.getMinutes();
    var curr_hour = d.getHours();
    var dt = curr_year + "-" + curr_month + "-" + curr_date + " ";
    dt += curr_hour + ":" + curr_minutes + ":" + curr_seconds;

    $.ajax({type: 'PUT',
        url: url,
        data: {PHOTO: photo, GENDER: gender, BIRTHDAY: birthday, NICKNAME: nickname, MARITAL_STATUS: ms, PREFERED_LANG: language, PREFERED_FOOD: food, BUDDY_BALANCE: 0, REGISTER_DATE: dt},
        success: function(resp) {
            console.log(resp);
        }
    });


    url = ip + "appibuddy/api/rest/auth_user/" + userid + ".json";

    $.ajax({type: 'PUT',
        url: url,
        data: {last_name: lastname, first_name: firstname},
        success: function(resp) {
            console.log(resp);
        }
    });
}

function gotPic(event) {

    if (event.target.files.length === 1 &&
            event.target.files[0].type.indexOf("image/") === 0) {

        var f = event.target.files[0];
        var obj = URL.createObjectURL(f);



        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
                // Render thumbnail.
                 var canvas = document.createElement('canvas');
                var img = new Image();
                img.src = e.target.result;

                var MAX_WIDTH = 150;
                var MAX_HEIGHT = 75;
                var width = img.width;
                var height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);
                var dataurl = canvas.toDataURL("image/png");

                window.localStorage.setItem("PHOTO", dataurl);
               
                $("#yourimage").attr("src", dataurl);
            };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
    }



}
////////////////////End Profile Detail

///////////////////Start Date Input

$(document).on("pageshow", "#registerBW", function() {

    $("#regBWForm").validate();

    var height = window.localStorage.getItem("HEIGHT");
    var weight = window.localStorage.getItem("WEIGHT");
    var bps = window.localStorage.getItem("BPS");
    var bpd = window.localStorage.getItem("BPD");
    var bmi = window.localStorage.getItem("bmi");
    var rhr = window.localStorage.getItem("RHR");

    $("#txtHeight").val(height);
    $("#txtWeight").val(weight);
    $("#txtBPS").val(bps);
    $("#txtBPD").val(bpd);
    $("#txtBMI").val(bmi);
    $("#txtRHR").val(rhr);

});

function saveBW() {

    $("#registerBW").submit(function() {
        return false;
    });
    $.mobile.showPageLoadingMsg();

    var height = $("#txtHeight").val();
    var weight = $("#txtWeight").val();
    var bps = $("#txtBPS").val();
    var bpd = $("#txtBPD").val();
    var bmi = $("#txtBMI").val();
    var rhr = $("#txtRHR").val();

    var error = 0;

    if (height === "" || weight === "" || bps === "" || bpd === "" || rhr === "") { //mobile ===""
        error = 1;
        $.mobile.hidePageLoadingMsg();
    }

    if (error === 0) {
        window.localStorage.setItem("HEIGHT", height);
        window.localStorage.setItem("WEIGHT", weight);
        window.localStorage.setItem("BPS", bps);
        window.localStorage.setItem("BPD", bpd);
        window.localStorage.setItem("bmi", bmi);
        window.localStorage.setItem("RHR", rhr);

        var userid = window.localStorage.getItem("userid");

        var d = new Date();
        var curr_date = d.getDate();
        var curr_month = d.getMonth() + 1; //Months are zero based
        var curr_year = d.getFullYear();
        var curr_seconds = d.getSeconds();
        var curr_minutes = d.getMinutes();
        var curr_hour = d.getHours();
        var dt = curr_year + "-" + curr_month + "-" + curr_date + " ";
        dt += curr_hour + ":" + curr_minutes + ":" + curr_seconds;


        var datainput = [];
        datainput.push({SCR_VARIABLE: "HEIGHT", SCR_UNIT: "CM", SCR_VALUE: height, SCR_DATE: dt, SCR_DEV_ID: 1, USER_ID: userid});
        datainput.push({SCR_VARIABLE: "WEIGHT", SCR_UNIT: "KG", SCR_VALUE: weight, SCR_DATE: dt, SCR_DEV_ID: 1, USER_ID: userid});
        datainput.push({SCR_VARIABLE: "RHR", SCR_UNIT: "", SCR_VALUE: rhr, SCR_DATE: dt, SCR_DEV_ID: 1, USER_ID: userid});
        datainput.push({SCR_VARIABLE: "BPS", SCR_UNIT: "", SCR_VALUE: bps, SCR_DATE: dt, SCR_DEV_ID: 1, USER_ID: userid});
        datainput.push({SCR_VARIABLE: "BPD", SCR_UNIT: "", SCR_VALUE: bpd, SCR_DATE: dt, SCR_DEV_ID: 1, USER_ID: userid});


        var url = ip + "appibuddy/api/bulk/SCREENING_HISTORY.json";

        var dic = {content: datainput};

        $.ajax({type: 'POST',
            url: url,
            contentType: "application/json",
            data: JSON.stringify(dic),
            success: function(resp) {
                console.log(resp);
                $.mobile.changePage("activityLevel.html");
                $.mobile.hidePageLoadingMsg();
            }
        });
    }
}


function saveGroupType() {
    window.localStorage.setItem("isAgree", "1");
    window.localStorage.setItem("group", "T");
}


///////////////////End Date Input
