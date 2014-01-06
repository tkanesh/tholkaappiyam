/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function checkInfo() {
    var yes = $("#radioYes").prop("checked");
    var no = $("#radioNo").prop("checked");

    if (!yes && !no) {
        alert("Please read the Information Sheet and confirm.");
    } else {
        if (yes) {
            $.mobile.changePage("parq.html");
        } else {
            $.mobile.changePage("goal.html");
            window.localStorage.setItem("isAgree", "0");
        }
    }
}


function completeParq() {
    alert("Please complete the ParQ.");
}
function completeConsent() {
    alert("Please read and agree the Consent Form");
}

function cfAgree() {
    $.mobile.showPageLoadingMsg();
    var group = window.localStorage.getItem("group");
    var userid = window.localStorage.getItem("userid");

    var d = new Date();

    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();
    var start = curr_year + "-" + curr_month + "-" + curr_date;

    var de = new Date()
    de.setMonth(de.getMonth() + 3);

    var end_date = de.getDate();
    var end_month = de.getMonth() + 1; //Months are zero based
    var end_year = de.getFullYear();
    var end = end_year + "-" + end_month + "-" + end_date;

    url = ip + "appibuddy/api/rest/TRIAL";
    $.ajax({type: 'POST',
        url: url,
        data: {USER_ID: userid, TGROUP: group, TEST_START_DATE: start, TEST_END_DATE: end},
        success: function(resp) {
            $.mobile.hidePageLoadingMsg();
            console.log(resp);
            $.mobile.changePage("goal.html");
        }
    });


}

function checkPass() {

    var data = [];
    data.push($('#togg_parq3').val());
    data.push($('#togg_parq4').val());
    data.push($('#togg_parq5').val());
    data.push($('#togg_parq6').val());
    data.push($('#togg_parq7').val())
    data.push($('#togg_parq8').val());
    data.push($('#togg_parq9').val());
    data.push($('#togg_parq10').val());
    data.push($('#togg_parq2').val());
    var ch = $("#check").prop("checked");

    var pass = 1;
    for (var i = 0; i < data.length; i++) {
        if (data[i] === "1") {
            pass = 0;
        }
    }

    if (ch) {

        document.getElementById("errorCheck").innerHTML = '';

        if (pass === 1) {
            $.mobile.changePage("dialog/dialogParqPass.html");
        } else {
            $.mobile.changePage("dialog/dialogParqFail.html");
        }
    } else {
        document.getElementById("errorCheck").innerHTML = '*Please Read and Check!';
    }
}

function goConcern() {
    var group = window.localStorage.getItem("group");
    console.log(group);
    if (group === "C") {
        $.mobile.changePage("../consentFormControl.html");
    } else if (group === "T") {
        $.mobile.changePage("../consentFormTest.html");
    }
}

