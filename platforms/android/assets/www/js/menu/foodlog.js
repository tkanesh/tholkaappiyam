function addFoodLog() {

    var foodId = window.localStorage.getItem("food_id");
    var mealType = window.localStorage.getItem("mealType");
    var foodname = window.localStorage.getItem("food_name");
    var energy = window.localStorage.getItem("food_energy");

    var foodlog = "";
    foodlog += foodId + "|" + mealType + "|" + foodname + "|" + energy;

    window.localStorage.setItem("addFood", foodlog);

    window.localStorage.setItem("isModify", "1");

    $.mobile.changePage("foodLogEntry.html");
}

$(document).on("pageshow", "#foodLog", function() {
    document.getElementById('foodLogConfirm').style.display = 'none';
    document.getElementById('fadeFoodLog').style.display = 'none';


    var foodLog = window.localStorage.getItem("foodLog");

    if (foodLog === null) {
        foodLog = "";
    }

    var userid = window.localStorage.getItem("userid");
    var currThisdate = window.localStorage.getItem("logDate");

    var d = new Date();
    if (currThisdate !== null && currThisdate !== "") {
        d = new Date(currThisdate);
    }
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();

    var dt = curr_year + "-" + curr_month + "-" + curr_date;


    window.localStorage.setItem("logDate", dt);

    var thisDate = getDay(d) + ", " + curr_date + " " + getMonthAbb(d) + " " + curr_year;


    $("#lblThisDate").html(thisDate);


    var url = ip + "appibuddy/api/bulk/userfood/" + userid + "/" + dt + ".json";
    var tempFoodLog = "";
    var hasContent = 0;

    var firstCheck = window.localStorage.getItem("firstLogCheck");



    if (firstCheck === null || firstCheck === "") {

        $.getJSON(url, function(result) {

            $.each(result, function(key, val) {
                hasContent = parseInt(val.length);

                if (hasContent >= 1) {
                    $.each(val, function(ke, va) {
                        var no = 0;

                        if (tempFoodLog.length > 0) {
                            tempFoodLog += ";";
                        }
                        $.each(va, function(k, v) {
                            if (k === "FOOD_ID" || k === "MEAL_TYPE_ID") {
                                tempFoodLog += v;


                                if (no === 0) {
                                    tempFoodLog += "|";
                                    no++;
                                } else {
                                    no = 0;
                                }
                            }
                        });

                    });
                }
            });


            if (hasContent === 0) {
                var addFood = window.localStorage.getItem("addFood");

                if (addFood !== null && addFood !== "") {

                    if (foodLog.length > 0) {
                        foodLog += ";";
                        window.localStorage.setItem("addFood", "");
                    }
                    foodLog += addFood;
                    window.localStorage.setItem("foodLog", foodLog);
                }
                generateLog(foodLog);
                barProgress();
            } else {
                var foodLogs = "";
                var tempFoods = tempFoodLog.split(";");
                for (var i = 0; i < tempFoods.length; i++) {
                    var foods = tempFoods[i].split("|");

                    var id = foods[0];
                    var mealType = parseInt(foods[1]);
                    var foodName = "";
                    var energy = "";

                    var url = ip + "appibuddy/api/food/id/" + foods[0] + ".json";
                    $.ajax({
                        url: url,
                        dataType: 'json',
                        async: false,
                        success: function(result) {
                            $.each(result, function(key, val) {
                                $.each(val, function(ke, va) {
                                    $.each(va, function(k, v) {
                                        if (k === "f_name") {
                                            foodName = v;

                                        }
                                        if (k === "energy") {
                                            energy = v;
                                        }
                                    });
                                });
                            });

                        }
                    });
                    switch (mealType)
                    {
                        case 1:
                            mealType = "breakfast";

                            break;
                        case 2:
                            mealType = "snack"
                            break;
                        case 3:
                            mealType = "lunch";
                            break;
                        case 4:
                            mealType = "dinner";
                            break;

                    }
                    if (foodLogs.length > 0) {
                        foodLogs += ";";
                    }
                    foodLogs += id + "|" + mealType + "|" + foodName + "|" + energy;

                }

                var addFood = window.localStorage.getItem("addFood");
                if (addFood !== null && addFood !== "") {


                    foodLogs += ";" + addFood;
                    window.localStorage.setItem("addFood", "");
                }
                window.localStorage.setItem("foodLog", foodLogs);

                generateLog(foodLogs);
                barProgress();

            }
        });

        window.localStorage.setItem("firstLogCheck", "0");
    } else {

        var addFood = window.localStorage.getItem("addFood");
        if (addFood !== null && addFood !== "") {
            if (foodLog.length > 0) {
                foodLog += ";";
                window.localStorage.setItem("addFood", "");
            }

            foodLog += addFood;

            window.localStorage.setItem("foodLog", foodLog);
        }
        generateLog(foodLog);

        barProgress();
    }



});

function barProgress() {

    var energy = window.localStorage.getItem("energyNeed");
    $('#lblEN').html(Math.round(energy));


    var energyConsumed = window.localStorage.getItem("energyTake");
    if (energyConsumed === null || energyConsumed === "") {
        energyConsumed = 0;
    }

    energyConsumed = Math.round(energyConsumed)
    var energyRemaining = Math.round(energy - energyConsumed);

    $('#lblCon').html(energyConsumed);
    $('#lblRem').html(energyRemaining > 0 ? energyRemaining : 0);


    if (energyConsumed > energy) {
        $("#tdEC").html("&nbsp;");
        $("#tdEC").css("width", "200px");
        $("#tdEC").css("background-color", "red");
    } else if (energyConsumed > 0) {
        $("#tdEC").html("&nbsp;");
        var ecPercentage = Math.round(energyConsumed / energy * 200);

        $("#tdEC").css("width", ecPercentage + "px");
        $("#tdEC").css("background-color", "#fcd260");
    } else if (energyConsumed <= 0) {
        $("#tdEC").html("");

        $("#tdEC").css("width", "0px");
    }

    var percentage = Math.round(energyConsumed / energy * 100);

    $('#lblEP').html(percentage + "%");



}

function getDay(d) {

    var weekday = new Array(7);
    weekday[0] = "Sun";
    weekday[1] = "Mon";
    weekday[2] = "Tues";
    weekday[3] = "Wed";
    weekday[4] = "Thurs";
    weekday[5] = "Fri";
    weekday[6] = "Sat";

    return  weekday[d.getDay()];

}

function getMonthAbb(d) {

    var month = new Array();
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "Jul";
    month[7] = "Aug";
    month[8] = "Sep";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";
    return month[d.getMonth()];
}

function generateLog(foodLog) {

    if (foodLog !== "") {
        var foodDetails = foodLog.split(";");
        var breakfast = "";
        var snack = "";
        var lunch = "";
        var dinner = "";
        var energy = 0;

        for (var i = 0; i < foodDetails.length; i++) {
            var foods = foodDetails[i].split("|");

            var html = "<tr><td width=\"76%\">" + foods[2] + "</td><td align=\"right\" width=\"20%\">" + foods[3] + " cal </td><td  align=\"right\">";

            energy += parseInt(foods[3]);
            console.log(foods[3]);


            html += "<img src=\"img/icon_delete.png\" onclick=\"deleteItem('" + foods[1] + "'," + foods[0] + ")\" />";
            html += "</td></tr>";

            switch (foods[1])
            {
                case "breakfast":
                    breakfast += html;

                    break;
                case "snack":
                    snack += html;
                    break;
                case "lunch":
                    lunch += html;
                    break;
                case "dinner":
                    dinner += html;
                    break;
            }

        }

        window.localStorage.setItem("energyTake", energy);


        $("#divBreakfast").append("<table width=\"100%\">" + breakfast + "</table>").trigger("create");
        $("#divSnack").append("<table width=\"100%\">" + snack + "</table>").trigger("create");
        $("#divLunch").append("<table width=\"100%\">" + lunch + "</table>").trigger("create");
        $("#divDinner").append("<table width=\"100%\">" + dinner + "</table>").trigger("create");
    } else {
        window.localStorage.setItem("energyTake", "0");
    }
}

function deleteItem(mealType, foodId) {
    var foodLog = window.localStorage.getItem("foodLog");
    var mt = mealType;
    var fid = foodId + "";
    var fdIndex = -1;
    console.log("deleteItem() foodLog=", foodLog);
    var foodDetails = foodLog.split(";");
    for (var i = 0; i < foodDetails.length; i++) {
        var foods = foodDetails[i].split("|");
        if (foods[1] === mt && foods[0] === fid) {
            fdIndex = i;
            break;
        }
    }

    window.localStorage.setItem("isModify", "1");

//food0-foodid
//food1-mealtype
//food2-foodname
//food3-energy

    console.log("idIndex=", fdIndex, "foodDetails=", foodDetails, "length=", foodDetails.length);
    if (fdIndex > -1) {
        foodDetails.splice(fdIndex, 1);
        $("#divBreakfast").empty();
        $("#divSnack").empty();
        $("#divLunch").empty();
        $("#divDinner").empty();

        var newFoodLog = "";
        console.log("foodDetails=", foodDetails, "length=", foodDetails.length);
        for (var i = 0; i < foodDetails.length; i++) {
            if (foodDetails[i].length)
            {
                newFoodLog += foodDetails[i];
                if (i < foodDetails.length - 1) //do not add ; separator at the end or split() will generate an empty elem at the end of the list
                    newFoodLog += ";";
            }
        }
        console.log("newFoodLog=", newFoodLog);
        window.localStorage.setItem("foodLog", newFoodLog);

        generateLog(newFoodLog);

        barProgress();

    }

}

function pad0Number(number)
{
    var numWith0Padding;
    if (number < 10)
        numWith0Padding = "0" + number.toString();
    else
        numWith0Padding = number.toString();
    return numWith0Padding;
}



function submitLog() {
    document.getElementById('foodLogConfirm').style.display = 'none';
    document.getElementById('fadeFoodLog').style.display = 'none';
    var foodLog = window.localStorage.getItem("foodLog");
    var currThisdate = window.localStorage.getItem("logDate");

    var d = new Date();
    if (currThisdate !== null && currThisdate !== "") {
        d = new Date(currThisdate);
    }

    //now current
    var log_date = d.getDate();
    var log_month = d.getMonth() + 1; //Months are zero based
    var log_year = d.getFullYear();
    var log_seconds = d.getSeconds();
    var log_minutes = d.getMinutes();
    var log_hour = d.getHours();
    var log_day = d.getDay();

    if (log_day === 0) {
        log_day = 7;
    }


    var mealdate = log_year + "-" + log_month + "-" + log_date;
    var updateTime = mealdate + " " + pad0Number(log_hour) + ":" + pad0Number(log_minutes) + ":" + pad0Number(log_hour);

    var userid = window.localStorage.getItem("userid");
//food0-foodid //food1-mealtype//food2-foodname//food3-energy
    var datainput = [];

    var foodDetails = foodLog.split(";");
    for (var i = 0; i < foodDetails.length; i++) {
        console.log("foodDetails[" + i + "/" + foodDetails.length + "]=" + foodDetails[i]);
        var foods = foodDetails[i].split("|");

        var time = "";
        var mtID = 0;
        switch (foods[1])
        {
            case "breakfast":
                time = " 07:00:00";
                mtID = 1;
                break;
            case "snack":
                time = " 16:00:00";
                mtID = 2;
                break;
            case "lunch":
                time = "  13:00:00";
                mtID = 3
                break;
            case "dinner":
                time = "  18:00:00";
                mtID = 4
                break;

        }

        var currMealDate = mealdate + time;
        datainput.push({FOOD_ID: parseInt(foods[0]), USER_ID: parseInt(userid), MEAL_DATE: currMealDate, MEAL_TYPE_ID: mtID, MEAL_DAY_ID: log_day, UPDATE_TIME:updateTime,REMARK:""});
    }


    for (var i = 0; i < datainput.length; i++) {
        console.log(datainput[i]);
    }

    
    var url = ip + "appibuddy/api/bulk/USER_FOOD.json";

    var dic = {content: datainput};

    $.ajax({type: 'POST',
        url: url,
        contentType: "application/json",
        data: JSON.stringify(dic),
        success: function(data, textStatus, jqXHR) {
            
            console.log("submitLog ajax POST SUCCESS", textStatus);
            document.getElementById('foodLogFeedBack').style.display = 'block';
            document.getElementById('fadeFoodLog').style.display = 'block';
            window.localStorage.setItem("isModify", "");
             $.each(data, function(key, val) {
                 console.log(key+":::::"+val);
             });
            
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("submitLog ajax POST ERROR:", jqXHR.status, textStatus, errorThrown);
            alert(jqXHR.status);
            alert(errorThrown);
        },
        complete: function(jqXHR, textStatus) {
            console.log("submitLog ajax POST COMPLETE, status:", jqXHR.status, textStatus);
        }
    });


}

function closeFeedBack() {
    document.getElementById('foodLogFeedBack').style.display = 'none';
    document.getElementById('fadeFoodLog').style.display = 'none';
}


function backMeal(type) {
    window.localStorage.setItem("mealType", type);
    $.mobile.changePage("main.html");

}

function confirmLog(direction) {

    window.localStorage.setItem("logDirection", direction + "");

    var isModify = window.localStorage.getItem("isModify");

    console.log(isModify);
    isModify = isModify === null ? "" : isModify;


    if (isModify === "1") {

        window.localStorage.setItem("isModify", "");
        document.getElementById('foodLogConfirm').style.display = 'block';
        document.getElementById('fadeFoodLog').style.display = 'block';
    } else {
        window.localStorage.setItem("isModify", "");
        changeLog();
    }

}

function stayLog() {
    document.getElementById('foodLogConfirm').style.display = 'none';
    document.getElementById('fadeFoodLog').style.display = 'none';
}

function changeLog() {
    var direction = parseInt(window.localStorage.getItem("logDirection"));

    var currThisdate = window.localStorage.getItem("logDate");

    var d = new Date();
    if (currThisdate !== null && currThisdate !== "") {
        d = new Date(currThisdate);
    }
    d.setDate(d.getDate() + direction);
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();

    var dt = curr_year + "-" + curr_month + "-" + curr_date + " ";

    window.localStorage.setItem("logDate", dt);

    var thisDate = getDay(d) + ", " + curr_date + " " + getMonthAbb(d) + " " + curr_year;

    window.localStorage.setItem("firstLogCheck", "");
    window.localStorage.setItem("foodLog", "");

    $("#lblThisDate").html(thisDate);


    $.mobile.changePage(
            window.location.href,
            {
                allowSamePageTransition: true,
                transition: 'none',
                showLoadMsg: false,
                reloadPage: true
            }
    );
}



