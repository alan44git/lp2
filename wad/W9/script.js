function getWeather() {
    var city = document.getElementById("city").value;

    var xhr = new XMLHttpRequest();

    xhr.open("GET", "weather.json", true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);

            if (data[city]) {
                document.getElementById("result").innerHTML =
                    "<h3>Weather in " + city + "</h3>" +
                    "Temperature: " + data[city].temperature + "<br>" +
                    "Humidity: " + data[city].humidity + "<br>" +
                    "Condition: " + data[city].condition;
            } else {
                document.getElementById("result").innerHTML =
                    "City not found!";
            }
        }
    };

    xhr.send();
}