function searchByOrigin(){
      var cat = window.localStorage.getItem("menuType");
      $.mobile.changePage("foodSearch.html?origin_id="+cat);
}

$(document).delegate("#menu", "pageinit", function() {
    var content = "";
    var url = ip + "appibuddy/api/food/fieldset_from_origin_with_img/";
    var cat = window.localStorage.getItem("menuType");//1. Chinese, 2. Malay, 3. Indian, 4.Western, 5.Thai, 6.Japanese, 7.Korean, 8.Filipino
    var title = "";

    switch (cat)
    {
        case "1":
            title = "Chinese";
            break;
        case "2":
            title = "Malay";
            break;
        case "3":
            title = "Indian";
            break;
        case "4":
            title = "Western";
            break;
        case "5":
            title = "Thai";
            break;
        case "6":
            title = "Japanese";
            break;
        case "7":
            title = "Korean";
            break;
        case "8":
            title = "Filipino";
            break;
    }

    var height = $(window).height();
    var width = $(window).width();
    var ypos = 40;
    if (height > 480) {
        ypos = (height - 400) / 2;
    }

    var xpos = 0;
    xpos = width / 2;

    $("#foodMenu").width(width);

    document.getElementById("lblCatTitle").innerHTML = title;
    var variables = "/id-file-itemName-carbohydrate-protein-totalFat-energy-gi-colour_id-perServing-colour_percentage.json";
    var noFood = 1;
    $.getJSON(url + cat + variables, function(result) {
        $.each(result, function(keys, vals) {
            $.each(vals, function(key, val) {
                $.each(val, function(k, v) {
                    window.localStorage.setItem(k, v);

                });
                var id = window.localStorage.getItem("id");
                var totalFat = window.localStorage.getItem("totalFat");
                var energy = window.localStorage.getItem("energy");
                var carb = window.localStorage.getItem("carbohydrate");
                var itemName = window.localStorage.getItem("itemName");
                var protein = window.localStorage.getItem("protein");
                var gi = window.localStorage.getItem("gi");
                var colorCode = window.localStorage.getItem("colour_id");
                var perServing = window.localStorage.getItem("perServing");
                var fileUrl = window.localStorage.getItem("fileURL");
                var cp = window.localStorage.getItem("colour_percentage");



                if (noFood <= 20) {

                    content += "<img hidden class='cloudcarousel' src='" + ip + "appibuddy/api/downloadthumb/" + id + "/150" + "'  width='114' height='90' alt='" + (noFood - 1) + "' title='";
                    content += "{\"totalFat\":\"" + totalFat + "\",";
                    content += "\"energy\":\"" + energy + "\",";
                    content += "\"carb\":\"" + carb + "\",";
                    content += "\"itemName\":\"" + itemName + "\",";
                    content += "\"protein\":\"" + protein + "\",";
                    content += "\"gi\":\"" + gi + "\",";
                    content += "\"perServing\":\"" + perServing + "\",";
                    content += "\"id\":\"" + id + "\",";
                    content += "\"img\":\"" + fileUrl + "\",";
                    content += "\"cp\":\"" + cp + "\",";
                    content += "\"colorCode\":\"" + colorCode + "\",";
                    content += "\"foodNo\":\"" + (noFood - 1) + "\"}";
                    content += "'/>";


                    noFood++;

                }

            });
        });



        $("#foodMenu").append(content).trigger("create");
        $("#foodMenu").CloudCarousel({
            reflHeight: 56, // BL 2013-10-30 temp disabled was: 56,
            reflGap: 2,
            //titleBox: $('#lblFoodName'),
            //altBox: $('#da-vinci-alt'),
            //buttonLeft: $('#but1'),
            //buttonRight: $('#but2'),
            FPS: 15,
            speed: 0.6,
            minScale: 0.6,
            yRadius: 40,
            xPos: xpos,
            yPos: ypos,
            swipe: true
        });

    });

var energy = window.localStorage.getItem("energyNeed");



  $('#lblMaxCal').html(energy + " cal");

});


$(document).on("pageshow", "#food", function() {
    var cab = parseInt(window.localStorage.getItem("food_cab"));
    var pro = parseInt(window.localStorage.getItem("food_pro"));
    var fat = parseInt(window.localStorage.getItem("food_fat"));
    var cp = window.localStorage.getItem("food_cp");
    var ps = window.localStorage.getItem("food_ps");
    var energy = window.localStorage.getItem("food_energy");
    var img = window.localStorage.getItem("food_img");//
    var food_id = window.localStorage.getItem("food_id");

    /***Download / display speed : Full image download replaced by thumbnail bellow
    if (img != null) //Checking. already Got Uncaught TypeError: Cannot call method 'substring' of null 
        $("#imgFood").attr("src", ip + img.substring(1));
    ***/
    if (food_id !== null) //Checking. already Got Uncaught TypeError: Cannot call method 'substring' of null 
        $("#imgFood").attr("src", ip + "appibuddy/api/downloadthumb/" + food_id + "/640");

    if (ps!==null)
       $('#lblPerServing').html(ps);
    if (energy!==null)
        $('#lblEnergy').html(energy);         

    var icp = parseInt(cp);
    if (icp > 50) {
        cp = "50";
    }

    $("#imgMeter").attr("src", "img/foodscale/0" + cp + ".png");



    var pieData = [
        {
            value: cab,
            color: "#FFA017",
            label: cab + 'g',
            labelColor: 'black',
            labelFontSize: '20px'
        },
        {
            value: pro,
            color: "#A4DB4D",
            label: pro + 'g',
            labelColor: 'black',
            labelFontSize: '20'
        },
        {
            value: fat,
            color: "#E6E6E6",
            label: fat + 'g',
            labelColor: 'black',
            labelFontSize: '23'
        }

    ];

    var myPie = new Chart(document.getElementById("canvas").getContext("2d")).Pie(pieData);
});

