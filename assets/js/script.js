var cityBtn = document.querySelector('button');
var city = "";

// weather location and current weather response from weatherapi
var current = {};
var loc = {};
var cityArr = [];

// Listen for City Entry on change
$("input").on('change', function(event){
    event.preventDefault();

    // set global variable city to the input field
    city = $(this).val();

    console.log("Search for ===== " + city)
    manageCityArr(); 
    getWeatherApi();
});

if (cityBtn !== null) {
    cityBtn.addEventListner('click',function() {
        city = $(this).val();
        manageCityArr();
        getWeatherApi();
    });
} else {console.log("cityBtn is null");}

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

    storeCities();        
}

function storeCities() {
    // Stringify and set cityArr to localStorage
    localStorage.setItem('cities', JSON.stringify(cityArr));
}

function updateCities() {
    // get cities from localStorage and write it into the cities Array
    cityArr = [];
    cityArr = JSON.parse(localStorage.getItem('cities'));
    manageCityArr();
}

function getWeatherApi() {
    // weatherapi apikey 132cab0e8fca4c42a8f204714202503
    var queryURL = "https://api.weatherapi.com/v1/forecast.json?key=132cab0e8fca4c42a8f204714202503&q="+city+",United States of America&days=5";
    $.ajax ({
        url: queryURL,
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
    console.log(typeof(current.uv) + " UV is ====== " + current.uv);

    if(current.uv < 3) {
        $('#uv').addClass('has-background-success'); 
    } else if (current.uv >= 3 && current.uv < 6){
        $('#uv').addClass('has-background-warning');
    } else if (current.uv >= 6 && current.uv < 8){
        $('#uv').attr('style', 'background-color: #ff4500;');
    } else {$('#uv').addClass('is-danger');}

}

updateCities();
