var city = "San Jose";
var cacheId = "";
var currentWeatherEl = document.getElementById('current-weather');

function getWeatherApi() {
    // weatherapi apikey 132cab0e8fca4c42a8f204714202503
    var queryurl = "https://api.weatherapi.com/v1/current.json?key=132cab0e8fca4c42a8f204714202503&q=" + city;
    $.ajax ({
        url: queryurl,
        method: "GET"
    })
      .then(function(response) {
        console.log("============= current weatherAPI results ==========");
        console.log(response);
        });
        prependCache(city);
}

// log the city into cache
function prependCache() {
    if (city !== "") {
        // Replace spaces with -
        cacheId = city.replace(/\s/g, "-");
        // create a <p> element for each cache
        var $cityCache = $("<p>");
        // give the <p> element an ID
        $cityCache.attr("id", cacheId);
        // create the element as child to div with id of city-cache
        $("#city-cache").prepend($cityCache);

        // render the city in the cache
        $("#"+cacheId).text(city);

    }
}

function setCacheLocStor() {


}

function getCacheLocStor() {
 
    // Populate the cache-id with stored data 
    for (i = 0; i < 18; i++) {
        
        var timeData = localStorage.getItem(time);
        if (timeData !== null) {
            // console.log("LocalStorage Value for time: " + timeData);
            document.getElementById(time).value = timeData;
        }
        var time = i + "30m";
            // console.log("LocalStorage Time is: " + time);
        var timeData = localStorage.getItem(time);
        if (timeData !== null) {
            // console.log("LocalStorage Value for time: " + timeData);
            document.getElementById(time).value = timeData;
        }
    }
}

// Listen for City Entry on change
$(document).ready(function () {

    // Listens for a chonge on the INPUT tags and logs it to LocalStorage
    $("input").on("change", function(event){
        event.preventDefault();
        // set variable city to the input field
        city = $(this).val();
        cacheId = city.replace(/\s/g, "-");
        console.log("cacheID is ==== " + cacheId);
        console.log("city is =======" + city);
        localStorage.setItem(cacheId, city);
    });


getWeatherApi();
