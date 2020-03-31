var city = "";

// weather location and current weather response from weatherapi
var current = {};
var loc = {};
var cityArr = [];

// Listen for City Entry on change
$("input").on('change', function(event){
    event.preventDefault();
    
    if ($(this).attr("class") === "input") {
        // set global variable city to the input field
        city = $(this).val();
        // Call manageCityArr to store to search criteria to localStore and render to the cityCache
        manageCityArr(); 
        // gets the weather filtered for the search criteria
        getWeatherApi();
    }
});

$(document).on('click',".button", function (event) {
    event.preventDefault();
        city = $(this).val();

        getWeatherApi();
});

// log the city into cache
function manageCityArr() {
    // If the cityArr has fewer than 10 elements, add the latest search item to the front of the array
    if (city !== "") {
        if (cityArr === null || cityArr.length === 0) {
            cityArr = [city];
            console.log("if null == " + cityArr);
        } else if (cityArr.length < 10) {
            cityArr.unshift(city);
            console.log("if < 10 == " + cityArr);
        } else {
            cityArr.pop();
            cityArr.unshift(city);
            console.log("pop - unshift == " + cityArr);
        }
    console.log("= cityArr from appendCache funct =");
    console.log(cityArr);
    }
    renderCache();
    storeCities();
}

// Displays the last 10 cities searched
function renderCache() {
    for (var i = 0; i < cityArr.length; i++) {
        // clears the cache
        if (i === 0) {
            $('#city-cache').empty();
        }
        // Append the button to the html cache div
        $('#city-cache').append('<input class="button" id="'+i+'">');
        $('#'+i).attr("value", cityArr[i]);
        console.log("each city cached ==== " + cityArr[i]);
    }
}

function storeCities() {
    // Stringify and set cityArr to localStorage
    localStorage.setItem('cities', JSON.stringify(cityArr));
}

function updateCities(init) {
    // get cities from localStorage and write it into the cities Array
    cityArr = [];
    cityArr = JSON.parse(localStorage.getItem('cities'));
    // if init = "init", set City to cityArr[0]
    if(init === "init") {
        city = cityArr[0];
        // get the weather for the last city visited and render it.
        getWeatherApi();
    }
    // Display on the screen in the button area
    renderCache();
}

function getWeatherApi() {
    // API Query for the weather filtering for the United States.
    var queryURL = "https://api.weatherapi.com/v1/forecast.json?key=132cab0e8fca4c42a8f204714202503&q="+city+",United States of America&days=5";
    $.ajax ({
        url: queryURL,
        method: "GET"
    })
      .then(function(response) {
        // console.log("============= current weatherAPI results ==========");
        // console.log(response);
        loc = response.location;
        current = response.current;
        render();
        renderForecast(response.forecast);
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

    var ccIcon = current.condition.icon;
    
    // validate that the icon link has https in the path
    if(ccIcon.indexOf(":") === -1) {
        ccIcon = "https:" + ccIcon;
    }

    // Create the span and image icon for the current condition
    $('#current').append($('<p id="currentCondition" class="content">'));
    // $('#currentCondIcon').append($('<img id="conditionIcon" SameSite="Secure">'));
    $('#currentCondition').html(current.condition.text + '<span><img SameSite="Secure" src='+ ccIcon +'></span>');

    // Render the Temperature and what it feels Like
    $('#current').append($('<p id="tempF">'));
    $('#tempF').html(current.temp_f + " <span>&#8457</span> " + " feels like  <strong>" + current.feelslike_f + " <span>&#8457</span></strong>");

    // Render the Humidity
    $('#current').append($('<p id="humidity">'));
    $('#humidity').html("Humidity is: " + current.humidity + "%");

    // render the Wind Speed and Direction
    $('#current').append($('<p id="wind">'));
    $('#wind').html("Wind is " + current.wind_mph + " MPH with heading of " + current.wind_dir);

    // Render the UV Index and background color
    $('#current').append($('<p id="uv">'));
    $('#uv').html("UV " + current.uv);
    console.log(typeof(current.uv) + " UV is ====== " + current.uv);

    if(current.uv < 3) {
        $('#uv').addClass('has-background-success'); 
    } else if (current.uv >= 3 && current.uv < 6){
        $('#uv').addClass('has-background-warning');
    } else if (current.uv >= 6 && current.uv < 8){
        $('#uv').attr('style', 'background-color: #ff4500;');
    } else {$('#uv').addClass('is-danger');}

}

function renderForecast(obj) {
    $('#forecast-div').empty();
    var forecast = obj.forecastday;
    
    console.log(forecast);
    // iterate through each object in the forecast array
    for (var i = 0; i < forecast.length; i++) {
        var date = formatedDate(forecast[i].date);
        console.log('Forecast Date is a ' + typeof(date) + ' === ' + date);
        // Create the tile (card) for each of the forecast days
        $('#forecast-div').append('<article id="forecast-'+i+'" class="box">');

        // Add the Date to each tile
        $('#forecast-'+i).append('<p id="fcDate-'+i+'" class="title">');
        $('#fcDate-'+i).text(date);

        // Add the forecasted condition
        var fcIcon = forecast[i].day.condition.icon;
        if(fcIcon.indexOf(":") === -1) {
            fcIcon = "https:" + fcIcon;
        }
        $('#forecast-'+i).append('<p id="fcCond-'+i+'" class="">');
        $('#fcCond-'+i).html(forecast[i].day.condition.text);
        $('#forecast-'+i).append('<img width="" id="fcIcon-'+i+'" src="'+fcIcon+'">');

        $('#forecast-'+i).append('<p id="fcTemp-'+i+'">');
        $('#fcTemp-'+i).html("Temp " + forecast[i].day.avgtemp_f + " <span>&#8457</span>");

        $('#forecast-'+i).append('<p id="fcHumidity-'+i+'">');
        $('#fcHumidity-'+i).html("Humidity " + forecast[i].day.avghumidity);

    }
}

formatedDate = function(strDate) {
    var monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Aug", "Nov", "Dec"];
    var date = strDate.slice(5).split('-');
    console.log(date);
    var i = parseInt(date[0]);
    var month = monthArr[i];
    console.log(month);
    console.log(date[1]);
    var strDate = month + " " + date[1];
    return strDate;

}

updateCities("init");
