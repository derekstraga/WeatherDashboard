var APIKey = "823016d80c8b85490616d6e0ed68f34a";
userCities = [];


function loadCities(){
    //get city array from localStorage
    var citiesStr = localStorage.getItem("cities");
    if(citiesStr !== null){
        userCities = JSON.parse(citiesStr);
    }
    //iterate through array, building divs for each city
    for(var i = 0; i < userCities.length; i++){
        $("#cities").append(buildCityDiv(userCities[i]));
    }
}

function buildCityDiv(city){
    var newDiv = $("<div>");
    newDiv.text(city);
    newDiv.attr("id", city);
    newDiv.attr("class", "city-div");
    return newDiv;
}

function displayCityData(city){
    $("#city-name").text(city);
    showWeather(city);
    showForecast(city);
}

function getBgURL(icon){

    var url = "";

    switch(icon) {

        case "01d":
        case "01n":
            url = "assets/clear_sky.jpg";
            break;

        case "02d":
        case "02n":
            url = "assets/partly_cloudy.jpg";
            break;

        case "03d":
        case "03n":
        case "04d":
        case "04n":
            url = "assets/cloudy.jpg";
            break;

        case "09d":
        case "09n":
        case "10d":
        case "10n":
            url = "assets/rain.jpg";
            break;

        case "11d":
        case "11n":
            url = "assets/Storm.jpg";
            break;

        case "13d":
        case "13n":
            url = "assets/Snow.jpg";
            break;

        case "50d":
        case "50n":
            url = "assets/Mist.jpg";
            break;
    }

    return url;
}

function showWeather(city){
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;

    $.ajax( {
        url: queryURL,
        method: "GET",
        error: function(){
            $("#city-name").text("City Not Found");
            $("#help-text").text("City Not Found");
            $("#current-temp").text("");
            $("#current-humidity").text("");
            $("#current-wind").text("");
            $("#current-date").text("");
            $("#current-icon").attr("src", "");
            $("#current-icon").attr("alt", "...");
            $("#uv-label").text("");
            $("#current-uv").text("");
            $("#current-bg").attr("src", "assets/images/no_data.jpg");
            $("#current-bg").attr("alt", "no weather image");
        }
    }).then(function(response) {

        $("#help-text").text("");  //clear error text on successful call

        $("#current-temp").text("Temperature: " + parseInt(response.main.temp) + "°F");
        $("#current-humidity").text("Humidity: " + response.main.humidity + "%");
        $("#current-wind").text("Wind Speed: " + parseInt(response.wind.speed) + " MPH");

        var date = moment.unix(response.dt);
        var dateStr = date.format("M/D/YYYY");
        $("#current-date").text(dateStr);

        var icon = response.weather[0].icon;
        var iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        $("#current-icon").attr("src", iconURL);
        $("#current-icon").attr("alt", "weather icon");

        var bgURL = getBgURL(icon);
        $("#current-bg").attr("src", bgURL);
        $("#current-bg").attr("alt", "weather background image");

        var lon = response.coord.lon;
        var lat = response.coord.lat;

        queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;

        $.ajax( {
            url: queryURL,
            method: "GET",
            error: function(){
                console.log("UV Index call failed");
            }
        }).then(function(response) {
            var uvIndex = response.value;
            var uvColor = "";
            if(uvIndex < 3){ uvColor = "green";}
            else if(uvIndex < 6){ uvColor = "yellow";}
            else if(uvIndex < 8){ uvColor = "orange";}
            else if(uvIndex < 11){ uvColor = "red";}
            else{ uvColor = "violet";}
            $("#uv-label").text("UV Index: ");
            $("#current-uv").text(uvIndex);
            $("#current-uv").attr("style", "background-color: " + uvColor);
        });
    });
}

function showForecast(city){
    queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + APIKey;

    $.ajax({
        url: queryURL,
        method: "GET",
        error: function(){
            for(var i = 0; i < 5; i++){
                $("#forecast-temp-" + i).text("");
                $("#forecast-humidity-" + i).text("");
                $("#forecast-date-" + i).text("");
                $("#forecast-icon-" + i).attr("src", "");
                $("#forecast-icon-" + i).attr("alt", "...");
                $("#forecast-bg-" + i).attr("src", "assets/images/no_data.jpg");
                $("#forecast-bg-" + i).attr("alt", "no weather image");
            }
            $("#carouselIndicatorsDiv").carousel(0);
        }
    }).then(function(response){

        for(var i = 0; i < 5; i++){
            timeIndex = i * 8 + 7;

            $("#forecast-temp-" + i).text("Temperature: " + parseInt(response.list[timeIndex].main.temp) + "°F");
            $("#forecast-humidity-" + i).text("Humidity: " + response.list[timeIndex].main.humidity + "%");
            var date = moment.unix(response.list[timeIndex].dt);
            var dateStr = date.format("M/D/YYYY");
            $("#forecast-date-" + i).text(dateStr);
            var icon = response.list[timeIndex].weather[0].icon;
            var iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            $("#forecast-icon-" + i).attr("src", iconURL);
            $("#forecast-icon-" + i).attr("alt", "weather icon");

            var bgURL = getBgURL(icon);
            $("#forecast-bg-" + i).attr("src", bgURL);
            $("#forecast-bg-" + i).attr("alt", "weather background image");
        }

        $("#carouselIndicatorsDiv").carousel(0);
    });
}

function addCity(city){
    //find existing matching city and remove from DOM and array
    for(var i = 0; i < userCities.length; i++){
        if(userCities[i] === city) {
            $("#" + city).remove();
            userCities.splice(i, 1);
        }
    }

    //add city to front of array  
    userCities.splice(0, 0, city);

    //build div and prepend to DOM
    newDiv = buildCityDiv(city);
    $("#cities").prepend(newDiv);

    //save updated userCities array to localStorage
    storeCities();
}

function storeCities(){
    localStorage.setItem("cities", JSON.stringify(userCities));
}


$(document).ready(function() {

    loadCities();

    //load most recently viewed city
    if (userCities[0] !== undefined){
        displayCityData(userCities[0]);
    }

    //create event listener for city submit button
    $("#city-submit").on("click", function(){
        event.preventDefault();
        var city = $("#city-input").val();
        $("#city-input").val("");  //clear input field

        if(city !== ""){
            addCity(city);
            displayCityData(city);
        }
    });

    $(document).on("click", ".city-div", function(event){
        var city = $(this).text();
        displayCityData(city);
    });
});