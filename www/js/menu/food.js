function searchFood(type) {
    window.localStorage.setItem("menuType", type);
    $.mobile.changePage("foodSelection.html");
}

function nextOne() {
    document.getElementById('menuTut0').style.display = 'none';
    document.getElementById('menuTut1').style.display = 'block';
}

function nextTwo() {
    document.getElementById('menuTut1').style.display = 'none';
    document.getElementById('menuTut2').style.display = 'block';
}

function closeDialog() {
    document.getElementById('menuTut2').style.display = 'none';
    document.getElementById('fade').style.display = 'none';

    window.localStorage.setItem("foodTut", "0");
}


$(document).ready(function() {


    /* BL2013/11/15 Actual Image size retrieval not used yet (hard coded value instead)
     * to keep there in case we need multiple image size depending on device
     var img = $("#foodcourtimg"); // Get my img elem
     var foodcourtimg_width, foodcourtimg_height;
     $("<img/>") // Make in memory copy of image to avoid css issues
     .attr("src", $(img).attr("src"))
     .load(function() {
     foodcourtimg_width = this.width;   // Note: $(this).width() will not
     foodcourtimg_height = this.height; // work for in memory images.
     console.log("foodcourtimg=", foodcourtimg_width,foodcourtimg_height);
     });
     */
    //BL 2013/11/15 Important swipe handler must be bound on document ready not on JQuery page load, that could be fired twice => generating fake double swipe events
    $(document).on('swipeleft', "#foodcourtdiv", function(event) {
        var deviceWidth, imageWidth = 1600, posleft, moveleft; //imageWidth actually rounded to nearest multiple of deviceWidth
        deviceWidth = $("[data-role='page']").first().width();
//   console.log("deviceWidth=",deviceWidth);
        posleft = $("#foodcourtdiv").offset().left;
        moveleft = deviceWidth;
        if (posleft - moveleft < deviceWidth - imageWidth)
            moveleft = deviceWidth - imageWidth - posleft;
//     console.log(posleft,"swipe left pos-=",moveleft);
        $("#foodcourtdiv").animate({"left": "-=" + moveleft + "px"}, 150, function() {
            // Animation complete.
//        console.log("After animate offset.left=",$("#foodcourtdiv").offset().left);
        }
        );
    });

    $(document).on('swiperight', "#foodcourtdiv", function(event) {
        var deviceWidth, posleft, moveleft;
        deviceWidth = $("[data-role='page']").first().width();
//     console.log("deviceWidth=",deviceWidth);
        posleft = $("#foodcourtdiv").offset().left;
        moveleft = deviceWidth;
        if (posleft + moveleft > 0)
            moveleft = -posleft;
//     console.log(posleft," swipe right pos+=",posleft);
        $("#foodcourtdiv").animate({"left": "+=" + moveleft + "px"}, 150, function() {
            // Animation complete.
            //    console.log("After animate offset.left=",$("#foodcourtdiv").offset().left);
        }
        );
    });
});

function changeMealType(type) {
    $("#mealType").find("li").css("background-color", "#ffffff");
    $("#mealType").find("li").css("color", "#36a348");
    $("#mealType2").find("li").css("background-color", "#ffffff");
    $("#mealType2").find("li").css("color", "#36a348");


    $("#" + type).css("background-color", "#36a348");
    $("#" + type).css("color", "#ffffff");

    window.localStorage.setItem("mealType", type);
}

$(document).on("pageshow", "#foodHome", function() {
    var isTut = window.localStorage.getItem("foodTut") + "";

    if (isTut !== "0") {

        document.getElementById('menuTut0').style.display = 'block';
        document.getElementById('fade').style.display = 'block';
    }

    var type = window.localStorage.getItem("mealType");

    if (type === null || type === "") {
        $("#breakfast").css("background-color", "#36a348");
        $("#breakfast").css("color", "#ffffff");

        window.localStorage.setItem("mealType", "breakfast");
    } else {
        $("#" + type).css("background-color", "#36a348");
        $("#" + type).css("color", "#ffffff");
    }



});
