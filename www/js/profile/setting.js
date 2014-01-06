


$(document).on("pageshow", "#profileSettings", function() {

    $("#regProForm").validate();
    $("#takePictureField").on("change", gotPic);

    desiredWidth = window.innerWidth;
    if (!("url" in window) && ("webkitURL" in window)) {
        window.URL = window.webkitURL;
    }

    var lastname = window.localStorage.getItem("last_name");
    var firstname = window.localStorage.getItem("first_name");
    var gender = window.localStorage.getItem("GENDER");
    var birthday = window.localStorage.getItem("birthday");
    var obj = window.localStorage.getItem("PHOTO");

    $("#txtLastName").val(lastname);
    $("#txtFirstName").val(firstname);

    $("#selectGender").val(gender).selectmenu('refresh');
    $("#txtBirthday").val(birthday);

    if (!(obj === "null")) {

        $("#yourimage").attr("src", obj);
    }
});




function updateProfile() {

    var profileid = window.localStorage.getItem("profileId");
    var userid = window.localStorage.getItem("userid");

    var firstname = $("#txtFirstName").val();
    var lastname = $("#txtLastName").val();
    var gender = $("#selectGender").val();
    var birthday = $("#txtBirthday").val();

    window.localStorage.setItem("lastname", lastname);
    window.localStorage.setItem("firstname", firstname);
    window.localStorage.setItem("GENDER", gender);
    window.localStorage.setItem("BIRTHDAY", birthday);

    var photo = window.localStorage.getItem("PHOTO");

    url = ip + "appibuddy/api/rest/PROFILE/" + profileid + ".json";

    $.ajax({type: 'PUT',
        url: url,
        data: {PHOTO: photo, BIRTHDAY: birthday, GENDER: gender},
        success: function(resp) {
            console.log(resp);
        }
    });

    url = ip + "appibuddy/api/rest/auth_user/" + userid + ".json";
    $.ajax({type: 'PUT',
        url: url,
        data: {first_name: firstname, last_name: lastname},
        success: function(resp) {
            alert("dala updated successfully");
        }
    });
}


$(document).on("pageshow", "#healthProfileSettings", function() {
    var height = window.localStorage.getItem("HEIGHT");
    var weight = window.localStorage.getItem("WEIGHT");
    var bps = window.localStorage.getItem("BPS");
    var bpd = window.localStorage.getItem("BPD");
    var bmi = calculateBMI(weight, height);
    var rhr = window.localStorage.getItem("RHR");
    var bodyfat = calculateBodyFat(weight, height);
    var al = window.localStorage.getItem("ACTIVITY_LEVEL");

    $("#lblHeight").html(height + " cm");
    $("#lblWeight").html(weight + " kg");
    $("#lblBMI").html(bmi + " kg/m<sup>2</sup>");
    $("#lblBodyFat").html(bodyfat + " %");
    $("#lblBodyFat").html(bodyfat + " %");
    $("#lblBP").html(bps + "/" + bpd + " mmHg");
    $("#lblRHR").html(rhr + " bpm");

    var alcolor = "";
    var alname = "";
    switch (al) {
        case "S":
            alcolor = "#8bc538";
            alname = "Sedentery";
            break;
        case "L":
            alcolor = "#AAE053";
            alname = "Low Active";
            break;
        case "A":
            alcolor = "#FFB031";
            alname = "Active";
            break;
        case "V":
            alcolor = "#FF8F33";
            alname = "Very Active";
            break;
        case "E":
            alcolor = "#F26925";
            alname = "Extreamly Active";
            break;
    }
    $("#lblAL").html(alname);
    $("#lblAL").css("color", alcolor);


    var insulin = window.localStorage.getItem("INSULIN");
    var insulincolor = "";
    var insulinType = "";
    switch (insulin) {
        case "No":
            insulincolor = "#8bc53f";
            alname = "Sedentery";
            insulinType = "0";
            break;
        case "Low":
            insulincolor = "#36A348";
            alname = "Low Active";
             insulinType = "1";
            break;
        case "Probably":
            insulincolor = "#F89E1C";
            alname = "Active";
             insulinType = "2";
            break;
        case "High":
            insulincolor = "#CE2000";
            alname = "Very Active";
             insulinType = "3";
            break;

    }
    window.localStorage.setItem("insulinType", insulinType);
    $("#lblIR").html(insulin);
    $("#lblIR").css("color", insulincolor);

    var tfeq = window.localStorage.getItem("TFEQ");
    window.localStorage.setItem("tfeqType", tfeq);
    var tfeqcolor = "";
    var tfeqname = "";

    switch (tfeq) {
        case "-1":
            tfeqcolor = "#2cac44";
            tfeqname = "Moderate Eating";
            break;
        case "0":
            tfeqcolor = "#d54500";
            tfeqname = "Uncontrolled Eating";
            break;
        case "1":
            tfeqcolor = "#737681";
            tfeqname = "Emotional Eating";
            break;
        case "2":
            tfeqcolor = "#FF9500";
            tfeqname = "Cognitive Restraint";
            break;

    }

    $("#lblEH").html(tfeqname);
    $("#lblEH").css("color", tfeqcolor);

});
