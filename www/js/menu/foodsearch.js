
function search_now(keyword) {

    var cat = 0;
    var searchString = window.location.search;
    if (searchString) {
        var params = searchString.split("?");
        if (params.length > 1 && params[1]) {
            var params = params[1].split("=");
            var cat = params[1];
        }
    }
    var content = "";
    data = "qtype=Insulin";
    var url = ip + "appibuddy/api/food/fieldset_from_origin_with_img/";
    //var cat = window.localStorage.getItem("menuType");//1. Chinese, 2. Malay, 3. Indian
    /* alert(cat) */
    var title = "";
    if (cat === "1") {
        title = "Chinese";
    } else if (cat === "2") {
        title = "Malay";
    } else {
        title = "Indian";
    }

    // Clear all existing search results
    $("#searchresult").empty()
    //alert("len ="+keyword.length)
    if (keyword.length <= 3) {
        /* alert("going call clear_seach()") */
        clear_search();
    }
    keyword = keyword.trim()
    if (keyword != '' && keyword.length >= 1) {
        //$("#searchresult").empty()

        var variables = "/id-file-f_name-itemName-carbohydrate-protein-totalFat-energy-gi-colour_id-perServing-colour_percentage.json?keyword=" + keyword;
        /* alert(url + cat + variables) */
        var noFood = 1;
        $.getJSON(url + cat + variables, function(result) {
            $.each(result, function(keys, vals) {
                $.each(vals, function(key, val) {
                    $.each(val, function(k, v) {
                        window.localStorage.setItem(k, v);
                    });
                    var id = window.localStorage.getItem("id");
                    // var totalFat = window.localStorage.getItem("totalFat"); 
                    var energy = window.localStorage.getItem("energy");
                    var carb = window.localStorage.getItem("carbohydrate");
                    var foodname = window.localStorage.getItem("f_name");
                    var itemName = window.localStorage.getItem("itemName");
                    var pro = window.localStorage.getItem("protein");
                    var fat = window.localStorage.getItem("totalFat");
                    /* var colorCode = window.localStorage.getItem("colour_id"); */
                    var perServing = window.localStorage.getItem("perServing");
                    var fileUrl = window.localStorage.getItem("fileURL");
                    var cp = window.localStorage.getItem("colour_percentage");
                    var ps = perServing.split(" ")[0];


                    src = ip + "appibuddy/api/downloadthumb/" + id + "/150";
                    code_img = ""
                    if (cp < 5) {
                        code_img = "code_green.png"
                    } else if (cp >= 5 && cp < 20) {
                        code_img = "code_yellow.png"
                    } else if (cp >= 20) {
                        code_img = "code_red.png"
                    }
                    var tr = '<tr onclick="view_food(\'' + id + '\',\'' + foodname + '\',\'' + energy + '\',\'' + carb + '\',\'' +pro + '\',\'' + fat + '\',\'' + fileUrl + '\',\'' + cp + '\',\'' + ps + '\')" style="padding-bottom:2px; background:#ffffff; "> <td width="100" > <img width="100" height="100" src="' + src + '"> </td> <td id="name1">' + foodname + '</td> <td style="text-align:right; vertical-align:middle; padding-right:10px;"><img src="img/' + code_img + '"></td> </tr><tr style="line-height:3px;"><td colspan="3">&nbsp;</td></tr>';
                    /* alert('itemName = '+itemName+'fileUrl = '+fileUrl+'cp = '+cp); */
                    $("#searchresult").append(tr)



                });
            });
        });
    }
    //alert($(window).height());
}

function clear_search() {
    try {
        document.getElementById("keyword").value = "   "
        $("#searchresult").empty()
    } catch (e) {
        alert(e)
    }
}

function view_food(id, foodname, energy, carb, pro, fat, fileUrl, cp,ps) {
    window.localStorage.setItem("food_id", id);
    window.localStorage.setItem("food_name", foodname);
    window.localStorage.setItem("food_energy", energy);
    window.localStorage.setItem("food_cab", carb);
    window.localStorage.setItem("food_pro", pro);
    window.localStorage.setItem("food_fat", fat);
    window.localStorage.setItem("food_img", fileUrl);
    window.localStorage.setItem("food_cp", cp)
    window.localStorage.setItem("food_ps",ps);
    
    console.log(carb);
    console.log(pro);
    console.log(fat);

    $.mobile.changePage("food.html");
    return;
}
