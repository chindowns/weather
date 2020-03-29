var city = "";
var cacheId = "";
// weather location and current weather response from weatherapi
var current = {};
var loc = {};

// Listen for City Entry on change

$("input").on("change", function(event){
    event.preventDefault();
    // set variable city to the input field
    city = $(this).val();
    cacheId = city.replace(/\s/g,'');
    console.log("Search for ===== " + city)
    prependCache(); 
    getWeatherApi();
});

// log the city into cache
function prependCache() {
    if (city !== "") {

        // create the element as child to div with id of city-cache
        $("#city-cache").prepend('<p id="' + cacheId + '">');

        // render the city in the cache
        $("#"+cacheId).text(city);

    }
}

function getWeatherApi() {
    // weatherapi apikey 132cab0e8fca4c42a8f204714202503
    var queryurl = "https://api.weatherapi.com/v1/current.json?key=132cab0e8fca4c42a8f204714202503&q=" + city + ", United States of America";
    $.ajax ({
        url: queryurl,
        method: "GET"
    })
      .then(function(response) {
        console.log("============= current weatherAPI results ==========");
        console.log(response);
        loc = response.location;
        current = response.current;
        render();
        });
}

function render() {
    // Clear current conditions rendered
    $('#current').empty();

    $('#current').append($('<p id="cityState" class="title">'));

    // Render the City and State
    $('#cityState').text(loc.name + ", " + loc.region);
            console.log('render funct ==== ' + loc.name + ", " + loc.region);

    //Render current conditions
            console.log('render funct ==== ' + current.temp_f);

    $('#current').append($('<p id="currentCondition" class="content">'));
    // $('#currentCondIcon').append($('<img id="conditionIcon" SameSite="Secure">'));
    $('#currentCondition').html(current.condition.text);

    // Create the span and image icon for the current condition
    $('#currentCondition').append($('<span id="curCondIcon">'));
    $('#curCondIcon').append($('<img id="icon" SameSite="Secure">'));
    $('#icon').attr("src", current.condition.icon);

    // Render the Temperature and what it feels Like
    $('#current').append($('<p id="tempF">'));
    $('#tempF').html(current.temp_f + " <span>&#8457</span> " + "F feels like <strong>" + current.feelslike_f + " <span>&#8457</span></strong>");

    // Render the Humidity
    $('#current').append($('<p id="humidity>'));
    $('#humidity').html(current.humidity);

    // render the Wind Speed and Direction
    $('#current').append($('<p id="wind">'));
    $('#wind').html(current.wind_mph + " MPH with heading: " + current.wind_dir);

    // Render the UV Index and background color
    $('#current').append($('<p id="uv">'));
    $('#uv').html(current.uv);
    
    if(current.uv < 3) {
        $('#uv').addClass('is-primary'); 
    } else if (current.uv >= 3 && current.uv < 6){
        $('#uv').addClass('is-warning');
    } else if (current.uv >= 6 && current.uv < 8){
        $('#uv').attr('style', 'background-color: orange;');
    } else {$('#uv').addClass('is-danger');}

}



