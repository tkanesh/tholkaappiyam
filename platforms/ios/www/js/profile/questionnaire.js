
/////////////////////Start Medical History////////////////////

function changeSubDisplay(mainId, sub) {

    var a = $("#" + mainId).val();

    if (a === undefined) {

        a = $("input[name=" + mainId + "]:checked").val();

        var result = sub.split("|");

        if (result[a] === "-1") {
            $("#sub" + mainId).hide();
        } else {
            $("#sub" + mainId).show();

            var b = result[a].split(",");
            $("input[name=slider-sub]").each(function() {
                var subId = $(this).attr("id") + "";

                $("#subsub" + subId).hide();

            });
            $("input[name=slider-sub]").each(function() {
                var subId = $(this).attr("id") + "";
                for (var i = 0; i < b.length; i++) {
                    if (subId === b[i]) {
                        $("#subsub" + subId).show();
                    }
                }
            });
        }
        return;
    }

    if (a === "0") {
        $("#sub" + mainId).hide();
    } else {
        $("#sub" + mainId).show();
    }
}


$(document).on("pageshow", "#medicalHistory", function() {
    $.mobile.showPageLoadingMsg("b", "Loading Medical History Survey");
    var content = "";
    var url = "";
    url = ip + "appibuddy/api/rest/questionnaire/MedicalHistory.json";
    $.getJSON(url, function(data) {
        $.each(data, function(key, val) {
            $.each(val, function(ke, va) {
                $.each(va, function(k, v) {
                    window.localStorage.setItem("MH_" + k, v);
                });

                var qId = window.localStorage.getItem("MH_id");

                url = ip + "appibuddy/api/rest/questype/" + qId + ".json";
                $.getJSON(url, function(data) {
                    $.each(data, function(key, val) {
                        $.each(val, function(ke, va) {

                            var mainQ;
                            var subQ;
                            $.each(va, function(k, v) {
                                $.each(v, function(a, b) {

                                    if (a === "mainques") {
                                        mainQ = JSON.parse(JSON.stringify(b));
                                    } else if (a === "subques") {
                                        subQ = JSON.parse(JSON.stringify(b));
                                    }

                                });
                            });
                            var id = mainQ.id;

                            var isReleased = mainQ.IS_RELEASED;
                            if (isReleased === 1) {

                                var htype = mainQ.HTML_TYPE;
                                var choice = mainQ.CHOICES;

                                content += "<div data-controltype=\"textblock\"><p>" + (ke + 1) + ".";
                                content += mainQ.QUESTION;
                                content += "</p></div>";
                                content += "<div data-role=\"fieldcontain\" data-controltype=\"toggleswitch\"";
                                content += "style=\"text-align: right;\">";

                                if (htype === "TF") {

                                    content += "<select name=\"togg_mh\" id=\"" + mainQ.id + "\"  data-theme=\"\"";
                                    content += "  data-role=\"slider\" data-mini=\"true\"";
                                    if (subQ !== undefined) {
                                        content += "onchange=\"changeSubDisplay(" + mainQ.id + ",0)\"";
                                    }
                                    content += ">";
                                    content += "<option value=\"0\">No</option>";
                                    content += "<option value=\"1\">Yes</option>";
                                    content += "</select>";

                                    if (subQ !== undefined) {

                                        content += "<div style=\"margin-left:20px\">";
                                        content += "<ul data-role=\"listview\" data-divider-theme=\"b\" data-inset=\"true\" id=\"sub" + mainQ.id + "\" style=\"display: none;\">";
                                        content += "<li data-role=\"fieldcontain\" style=\"background-color: #ffffff\" >";


                                        for (var i = 0; i < subQ.length; i++) {
                                            var stype = subQ[i].HTML_TYPE;
                                            if (stype === "TF") {
                                                content += "<table >";
                                                content += "<tr>";
                                                content += "<td width=\"200px\">"
                                                content += subQ[i].QUESTION + "</td>";
                                                content += "<td width=\"100px\" align=\"right\">";
                                                content += "<select name=\"fAllergyDiary\" id=\"" + subQ[i].id + "\" data-theme=\"\" ";
                                                content += "data-role=\"slider\" data-mini=\"true\">";
                                                content += "<option value=\"0\">No</option>";
                                                content += "<option value=\"1\">Yes</option>";
                                                content += "</select>";
                                                content += "</td> </tr></table>";
                                            }
                                            else if (stype === "text") {
                                                content += "<table >";
                                                content += "<tr>";
                                                content += "<td width=\"200px\"> "
                                                content += subQ[i].QUESTION + "</td>";
                                                content += "<td width=\"150px\" >";
                                                content += "<input name=\"mhtext\" id=\"" + subQ[i].id + "\" placeholder=\"\" value=\"\"  class=\"required\">";
                                                content += "</td> </tr></table>";
                                            }
                                        }
                                        content += "</li></ul>";
                                        content += "</div>";
                                    }

                                } else if (htype === "radio") {

                                    //choice: 1:Yes (value:label)
                                    //answer_result: -1|44|4,45 (meaing index 0(choice value 0, do not show anything; 
                                    var vals = mainQ.CHOICES;
                                    var a = vals.split("|");

                                    content += "<div>";
                                    content += "<div style=\"text-align:center;margin-left:-100px\">";
                                    content += "<fieldset data-role=\"controlgroup\" data-type=\"horizontal\"  data-mini=\"true\">";

                                    for (i = 0; i < a.length; i++) {
                                        var b = a[i].split(":");
                                        content += "<input type=\"radio\" name=\"" + mainQ.id + "\" id=\"radio-choice-2" + i + "\" value=\"" + b[0] + "\" ";
                                        if (i === 2) {
                                            content += "checked=\"checked\" ";
                                        }
                                        var ar = mainQ.ANSWER_RESULT;

                                        content += "onchange=\"changeSubDisplay(" + mainQ.id + ",'" + ar + "')\"";
                                        content += "/>";
                                        content += " <label for=\"radio-choice-2" + i + "\"><span  style=\"font-size:10pt\">" + b[1] + "</span></label>";
                                    }

                                    content += "</fieldset>";
                                    content += "</div>";
                                    if (subQ !== undefined) {
                                        content += "<div style=\"margin-left:20px\" >";
                                        content += "<ul data-role=\"listview\" data-divider-theme=\"b\" data-inset=\"true\" id=\"sub" + mainQ.id + "\" style=\"display: none;\">";
                                        content += "<li  style=\"background-color: #ffffff\"  >";

                                        for (var i = 0; i < subQ.length; i++) {
                                            var stype = subQ[i].HTML_TYPE;
                                            if (stype === "slider") {
                                                var vals = subQ[i].CHOICES;
                                                var a = vals.split("-");
                                                min = a[0];
                                                max = a[1];
                                                var value = 0;

                                                content += "<div id=\"subsub" + subQ[i].id + "\">";
                                                content += "<div data-controltype=\"textblock\"><p>";
                                                content += subQ[i].QUESTION;
                                                content += "</p></div>";

                                                content += "<div  style=\"margin-bottom:20px\">";
                                                content += "<input type=\"range\"  name=\"slider-sub\" id=\"" + subQ[i].id + "\" value=\"" + value + "\" min=\"" + min + "\" max=\"" + max + "\" step=\"1\" data-highlight=\"true\"  />";
                                                content += "</div>";
                                                content += "</div>";
                                            }
                                        }
                                        content += "</li>";
                                        content += "</ul>";
                                        content += "</div>";
                                    }
                                    content += "</div>";

                                } else if (htype === "slider") {
                                    var vals = mainQ.CHOICES;
                                    var min = 0;
                                    var max = 5;
                                    var value = 0;

                                    if (vals.indexOf("-") > -1) {
                                        var a = vals.split("-");
                                        min = a[0];
                                        max = a[1];
                                        content += "<div>";
                                        content += "<input type=\"range\"  name=\"slider-main\" id=\"" + mainQ.id + "\" value=\"" + value + "\" min=\"" + min + "\" max=\"" + max + "\" step=\"1\" data-highlight=\"true\"  />";
                                        content += "</div>";
                                    } else if (vals.indexOf("|") > -1) {

                                        var b = vals.split("|");
                                        min = 1;
                                        max = b.length;

                                        content += "<div style=\"width:300px\">";
                                        content += "<div>"
                                        content += "<input type=\"range\"  name=\"slider-main\" id=\"" + mainQ.id + "\" value=\"" + value + "\" min=\"" + min + "\" max=\"" + max + "\" step=\"1\" data-highlight=\"true\"  class=\"ui-hidden-accessible\" />";
                                        content += "</div>";
                                        content += "<div style=\"text-align:left;\">";

                                        for (i = 0; i < b.length; i++) {
                                            var c = b[i].split(":");
                                            var marginLeft = 0;

                                            switch (i)
                                            {
                                                case 0:
                                                    marginLeft = 5;
                                                    break;
                                                case 1:
                                                    marginLeft = 30;
                                                    break;
                                                case 2:
                                                    marginLeft = 32;
                                                    break;
                                                case 3:
                                                    marginLeft = 32;
                                                    break;
                                                case 4:
                                                    marginLeft = 27;
                                                    break;
                                            }
                                            content += " <span style=\"display:inline-block;width: 20px;text-align:center;margin-left:" + marginLeft + "px;vertical-align:top;\">|<br />" + c[1] + "</span>";
                                        }
                                        content += "</div>";
                                        content += "</div>";
                                    }
                                }
                                content += "</div>";
                            }
                        });
                    });
                    $("#contentQuiz").append(content).trigger("create");
                    $.mobile.hidePageLoadingMsg();
                });
            });
        });
    });
});

function saveMedicalHistory() {

    var userid = window.localStorage.getItem("userid");
    $.mobile.showPageLoadingMsg();
    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();
    var curr_seconds = d.getSeconds();
    var curr_minutes = d.getMinutes();
    var curr_hour = d.getHours();
    var dt = curr_year + "-" + curr_month + "-" + curr_date + " ";
    dt += curr_hour + ":" + curr_minutes + ":" + curr_seconds;
    var medicalHistory = [];



    $("select").each(function() {
        var result = $(this).val();
        var id = $(this).attr("id");
        medicalHistory = insertAnswer(medicalHistory, userid, id, result, dt);

    });
    $("input[name=slider-main]").each(function() {
        var result = $(this).val();
        var id = $(this).attr("id");
        medicalHistory = insertAnswer(medicalHistory, userid, id, result, dt);
    });
    $("input[name=slider-sub]").each(function() {
        var result = $(this).val();
        var id = $(this).attr("id");
        medicalHistory = insertAnswer(medicalHistory, userid, id, result, dt);

    });
    $("input[name=mhtext]").each(function() {
        var result = $(this).val();
        var id = $(this).attr("id");
        medicalHistory = insertAnswer(medicalHistory, userid, id, result, dt);

    });
    var radioResult = $("input[type=radio]:checked").val();
    var radioId = $("input[type=radio]:checked").attr("name");

    medicalHistory = insertAnswer(medicalHistory, userid, radioId, radioResult, dt);
    var url = ip + "appibuddy/api/bulk/USER_QUESTION.json";

    var dic = {content: medicalHistory};

    $.ajax({type: 'POST',
        url: url,
        contentType: "application/json",
        data: JSON.stringify(dic),
        success: function(data, textStatus, jqXHR) {
            console.log(textStatus);
            $.mobile.hidePageLoadingMsg();
            $.mobile.changePage("dialog/dialogInsulinResistance.html");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.status, textStatus, errorThrown);
            alert(jqXHR.status);
            alert(errorThrown);
        },
        complete: function(jqXHR, textStatus) {
            console.log("ajax POST complete, status:", jqXHR.status, textStatus)
        }
    });
}

function insertAnswer(objArray, userid, id, result, date) {
    var obj = {USER_ID: userid, QUES_ID: id, ANSWER: result, ANSWER_DATE: date};

    objArray.push(obj);
    return objArray;
}

/////////////////////End Medical History////////////////////

/////////////////////Start Insulin////////////////////
$(document).on("pageshow", "#insulin", function() {

    var content = "";
    var qId = "";
    url = ip + "appibuddy/api/rest/questions/2.json";
    $.mobile.showPageLoadingMsg();

    $.getJSON(url, function(result) {
        $.each(result, function(keys, vals) {
            $.each(vals, function(key, val) {

                $.each(val, function(k, v) {

                    window.localStorage.setItem("insulin_" + k, v);
                });
                var id = window.localStorage.getItem("insulin_id");
                var isReleased = window.localStorage.getItem("insulin_IS_RELEASED");
                if (isReleased === "1") {
                    var htype = window.localStorage.getItem("insulin_HTML_TYPE");
                    content += "<div data-controltype=\"textblock\"><p>" + (key + 1) + ".";
                    content += window.localStorage.getItem("insulin_QUESTION");
                    content += "</p></div>";
                    content += "<div data-role=\"fieldcontain\" data-controltype=\"toggleswitch\"";
                    content += "style=\"text-align: right;\">"
                    // if (htype==="radio"){
                    content += "<select name=\"togg_insulin\" id=\"togg_quiz1\"  data-theme=\"\"";
                    content += "  data-role=\"slider\" data-mini=\"true\">";
                    content += "<option value=\"0\">No</option>";
                    content += "<option value=\"1\">Yes</option>";
                    content += "</select>";
                    //  }

                    content += "</div>";
                }
            });
        });
        $("#contentQuiz").append(content).trigger("create");
        $("#togg_quiz1").slider();
        var url = ip + "appibuddy/api/rest/questionnaire/Insulin.json";
        $.getJSON(url, function(result) {

            $.each(result, function(keys, vals) {
                $.each(vals, function(key, val) {
                    $.each(val, function(ke, va) {
                        window.localStorage.setItem("insulin_" + ke, va);

                    });
                });
            });
        });

        $.mobile.hidePageLoadingMsg();
    });

});

function qInsulin(typeN) {
    var answer = 0;
    var chType = "";
    $("select").each(function() {
        // do something exciting with each div
        answer += parseInt($(this).val());

    });
    var type = window.localStorage.getItem("insulin_FINAL_RESULT");
    var reward = window.localStorage.getItem("insulin_BUDDIES_VALUE");
    var obj = jQuery.parseJSON(type);
    $.each(obj, function(keys, vals) {
        var run = 1;
        $.each(vals, function(key, val) {

            if (run === 1) {
                var limit = 0;
                var ch = "";
                $.each(val, function(ky, vl) {

                    if ($.isNumeric(vl)) {
                        limit = vl;
                    } else {
                        ch = vl;
                    }

                });
                if (answer <= limit) {
                    chType = ch;
                    run = 0;
                }
            }
        });
    });
    if (chType.indexOf("No") > -1) {

        window.localStorage.setItem("insulinType", "0");
    } else if (chType.indexOf("Low") > -1) {
        window.localStorage.setItem("insulinType", "1");
    } else if (chType.indexOf("Probably") > -1) {
        window.localStorage.setItem("insulinType", "2");
    } else if (chType.indexOf("High") > -1) {
        window.localStorage.setItem("insulinType", "3");
    }
    var userid = window.localStorage.getItem("userid");
    window.localStorage.setItem("INSULIN", chType);


    if (typeN === 0) {
        url = ip + "appibuddy/api/rest/USER_QUESTIONNAIRE";
        $.ajax({type: 'POST',
            url: url,
            data: {USER_ID: userid, QNR_ID: "2", RESULTS: chType},
            success: function(resp) {
                console.log(resp);
            }
        });
    } else {
        var insulinId = window.localStorage.getItem("INSULIN_ID");
        url = ip + "appibuddy/api/rest/USER_QUESTIONNAIRE/" + insulinId + ".json";
        $.ajax({type: 'PUT',
            url: url,
            data: {USER_ID: userid, QNR_ID: "2", RESULTS: chType},
            success: function(resp) {
                console.log(resp);
            }
        });
    }


}
$(document).on("pageshow", "#insulinResult", function() {
    var chType = window.localStorage.getItem("insulinType");
    var img = "";
    var title = "";
    var description = "";
    switch (chType)
    {
        case "0":
            img = "../../img/gr_insulin0.png";
            title = "Not Predisposed";
            description = "Congratulations! You are not predisposed to insulin resistance. Keep it up with a healthy lifestyle!";
            break;
        case "1":
            img = "../../img/gr_insulin1.png";
            title = " Low Probability";
            description = "You are currently at low probability, but might be setting the stage for Insulin Resistance.";
            break;
        case "2":
            img = "../../img/gr_insulin2.png";
            title = "Probably";
            description = "You are probably insulin resistant. Recommend to take action to reverse Insulin Resistance.";
            break;
        case "3":
            img = "../../img/gr_insulin3.png";
            title = "High Probability";
            description = "There is a high probability that you have Insulin Resistance. Highly recommended in taking action to reverse it now.";
            break;
    }

    $("#insulinType").attr("src", img);
    document.getElementById("insulinTitle").innerHTML = title;
    document.getElementById("insulinDescription").innerHTML = description;
});
/////////////////////End Insulin////////////////////

/////////////////////Start TFEQ////////////////////
$(document).on("pageshow", "#tfeq", function() {
    $.mobile.showPageLoadingMsg("b", "Loading Eating Habits Survey");
    var content = "";
    var url = ip + "appibuddy/api/rest/questions/3.json";
    $.getJSON(url, function(result) {
        var lastid = "0";
        $.each(result, function(keys, vals) {
            $.each(vals, function(key, val) {
                $.each(val, function(k, v) {
                    window.localStorage.setItem("tfeq_" + k, v);
                });
                var id = window.localStorage.getItem("tfeq_id");
                var isReleased = window.localStorage.getItem("tfeq_IS_RELEASED");
                if (isReleased === "1") {
                    var htype = window.localStorage.getItem("tfeq_HTML_TYPE");
                    var choice = window.localStorage.getItem("tfeq_CHOICES");
                    var choices = choice.split("|");
                    content += "<div data-controltype=\"textblock\"><p>" + (key + 1) + ".";
                    content += window.localStorage.getItem("tfeq_QUESTION");
                    content += "</p></div>";

                    var id = window.localStorage.getItem("tfeq_ANSWER_RESULT")
                    if (choices.length > 4) {
                        var val = 0;
                        var min = 0 + 1;
                        var max = choices.length;
                        content += "<div>";
                        content += "<input type=\"range\"  name=\"slider-main\" id=\"" + id + "\" value=\"0" + "\" min=\"" + min + "\" max=\"" + max + "\" step=\"1\" data-highlight=\"true\"  />";
                        content += "</div>";
                    } else {
                        var min = 1;
                        var max = choices.length;

                        content += "<div data-role=\"fieldcontain\">";
                        content += "<div style=\"width:290px;padding-top:5px\"  >";

                        content += "<div >"
                        content += "<input type=\"range\"  name=\"slider-main\" id=\"" + id + "\"  min=\"1\" max=\"" + max + "\" step=\"1\" data-highlight=\"true\" value=\"1\"  class=\"ui-hidden-accessible\" />";
                        content += "</div>";
                        content += "<div style=\"text-align:left;\">";
                        lastid = id;

                        for (var i = 0; i < choices.length; i++) {
                            var marginLeft = 0;
                            var a = choices[i].split(",");
                            var value = a[1];
                            var label = a[0];

                            switch (i)
                            {
                                case 0:
                                    marginLeft = 0;
                                    break;
                                case 1:
                                    marginLeft = 28;
                                    break;
                                case 2:
                                    marginLeft = 30;
                                    break;
                                case 3:
                                    marginLeft = 30;
                                    break;
                                case 4:
                                    marginLeft = 27;
                                    break;
                            }
                            content += " <span style=\"display:inline-block;width: 35px;text-align:center;margin-left:" + marginLeft + "px;vertical-align:top;font-size:9pt\">|<br />" + label + "</span>";
                        }
                        content += "</div>";
                        content += "</div>";
                        content += "</div>";
                    }
                }
            });
        });
        $("#contentQuiz").append(content).trigger("create");
        $("#" + lastid).slider();
        $.mobile.hidePageLoadingMsg();
    });
});

function findPoint(value, points) {
    var point = 0;
    for (var i = 0; i < points.length; i++) {
        var a = points[i].split("o");
        if (a[0] === value) {
            point = parseInt(a[1]);
            return point;
        }
    }
}
function qTfeq(type) {
    var dPoint = [];
    var UE = 0;
    var EE = 0;
    var CR = 0;
    dPoint.push(UE);
    dPoint.push(EE);
    dPoint.push(CR);

    $("input[name=slider-main]").each(function() {

        var id = $(this).attr("id")
        var value = $(this).val();

        var result = id.split("_");
        var type = result[0];

        var points = result[1].split("v");

        if (type === "UE") {

            var point = 0;
            point = findPoint(value, points);

            dPoint[0] = dPoint[0] + point;
        } else if (type === "EE") {
            var point = 0;
            point = findPoint(value, points);
            dPoint[1] = dPoint[1] + point;
        } else if (type === "CR") {

            var point = 0;
            point = findPoint(value, points);
            dPoint[2] = dPoint[2] + point;
        }
    });
    var cType = "";

    if (isNaN(dPoint[2])) {
        alert("Please answer  the last question");
    } else {

        var data = [];
        var normalUE = dPoint[0] > 4 ? 0 : 1;
        var normalEE = dPoint[1] > 1 ? 0 : 1;
        var normalCR = dPoint[2] > 4 ? 0 : 1;

        data.push(normalUE);//0
        data.push(normalEE);//1
        data.push(normalCR);//2

        var basketNormal = [];
        var basketOver = [];
        for (var i = 0; i < data.length; i++) {

            if (data[i] === 1) {
                basketNormal.push(i);

            } else {
                basketOver.push(i);
            }
        }


        var typeId = 0;
        if (basketOver.length <= 0) {
            typeId = -1;
            window.localStorage.setItem("tfeqType", "-1");
            window.localStorage.setItem("TFEQ", "-1");
            cType = "Normal";
        } else {

            if (basketNormal.length >= 2) {
                typeId = basketOver[0];
            } else {
                var a = basketOver[0];
                var b = basketOver[1];

                if (dPoint[a] > dPoint[b]) {
                    typeId = a;
                } else {
                    typeId = b;
                }
            }

            if (typeId === 0) {
                window.localStorage.setItem("tfeqType", "0");
                 window.localStorage.setItem("TFEQ", "0");
                cType = "Uncontrolled Eating";
            } else if (typeId === 1) {
                window.localStorage.setItem("tfeqType", "1");
                 window.localStorage.setItem("TFEQ", "1");
                cType = "Emotional Eating";
            } else if (typeId === 2) {
                window.localStorage.setItem("tfeqType", "2");
                 window.localStorage.setItem("TFEQ", "2");
                cType = "Cognitive Restraint";
            }
        }

        var userid = window.localStorage.getItem("userid");
        if (type === 0) {
            url = ip + "appibuddy/api/rest/USER_QUESTIONNAIRE";
            $.ajax({type: 'POST',
                url: url,
                data: {USER_ID: userid, QNR_ID: "3", RESULTS: typeId},
                success: function(resp) {
                    $.mobile.changePage("tfeqResult.html")
                }
            });
          
        } else {
            var tfeqId = window.localStorage.getItem("TFEQ_ID");
            url = ip + "appibuddy/api/rest/USER_QUESTIONNAIRE/" + tfeqId + ".json";
            $.ajax({type: 'PUT',
                url: url,
                data: {USER_ID: userid, QNR_ID: "3", RESULTS: typeId},
                success: function(resp) {
                    $.mobile.changePage("tfeqResult.html")
                }
            });
        }

    }
}

$(document).on("pageshow", "#tfeqResult", function() {
    var chType = window.localStorage.getItem("tfeqType");
    var img = "";
    var title = "";
    var description = "";
    switch (chType)
    {
        case "-1":
            img = "../../img/eating_me.gif";
            title = "Moderate Eating";
            description = "You eat in response to external food cues such as sight and smell of food.";
            description += "You have no particular eating habit. Keep eating in moderation and don't be influenced to change your eating habit.";
            break;
        case "0":
            img = "../../img/eating_ue.gif";
            title = "Uncontrolled Eating";
            description = "You eat in response to external food cues such as sight and smell of food.";
            description += "You tend to eat more than usual due to a loss of control over intake accompanied by the subjective feeling of hunger.";
            break;
        case "1":
            img = "../../img/eating_ee.gif";
            title = "Emotional Eating";
            description = "Emotional eating is a relatively common problem for both men and women. ";
            description += "You eat in response to your feelings, especially when you are not hungry. ";
            description += "Emotional eating means your emotions -- not your body -- dictate when and/or how much you eat. ";
            break;
        case "2":
            img = "../../img/eating_cr.gif";
            title = "Cognitive Restraint";
            description = "You overeat after a period of slimming when the cognitive resolve to diet is abandoned.";
            description += "Conscious restriction of food intake in order to control body weight or to promote weight loss .";
            break;
    }

    $("#tfeqType").attr("src", img);
    document.getElementById("tfeqTitle").innerHTML = title;
    document.getElementById("tfeqDescription").innerHTML = description;
});
/////////////////////End TFEQ////////////////////