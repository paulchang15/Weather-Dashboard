const citySearch = function () {
  const city = document.getElementById("city-input").value;
  document.getElementById("city-input").value = "";
  getCurrentWeather(city);
  const cities = JSON.parse(localStorage.getItem("city-search"));
  if (!cities.includes(city)) {
    cities.push(city);
  }
  localStorage.setItem("city-search", JSON.stringify(cities));

  displayCity();
};

const getCurrentWeather = function (city) {
  const apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=dcf1204250eaf428bd38b32193c2f18c";

  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      const uvUrl =
        "https://api.openweathermap.org/data/2.5/uvi?lat=" +
        data.coord.lat +
        "&lon=" +
        data.coord.lon +
        "&appid=dcf1204250eaf428bd38b32193c2f18c";
      fetch(uvUrl).then(function (uvResponse) {
        uvResponse.json().then(function (uvData) {
          displayWeather(
            data.name,
            data.main.temp,
            data.main.humidity,
            data.wind.speed,
            uvData.value
          );
          console.log(uvData);
        });
      });
      getFiveDays(data.coord.lat, data.coord.lon);
      console.log(data);
    });
  });
};
const displayCity = function () {
  const cities = JSON.parse(localStorage.getItem("city-search"));
  document.getElementById("saved-cities").innerHTML = "";
  for (let i = 0; i < cities.length; i++) {
    document.getElementById(
      "saved-cities"
    ).innerHTML += `<li class="list-group-item city" >${cities[i]}</li>`;
  }
  document.querySelectorAll(".city").forEach(function (item) {
    item.addEventListener("click", function () {
      getCurrentWeather(this.textContent);
    });
  });
};
const getFiveDays = function (lat, lon) {
  const daysURL =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial&appid=dcf1204250eaf428bd38b32193c2f18c";

  fetch(daysURL)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      document.getElementById("five-day").innerHTML = "";
      for (let i = 1; i < 6; i++) {
        document.getElementById("five-day").innerHTML += `   
        <div class="col">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title">${new Date(
                data.daily[i].dt * 1000
              ).toDateString()}</h4>
              <div class="card-text">
                <h5>Temp: ${data.daily[i].temp.day} °F</h5>
                <h5>Humidity: ${data.daily[i].humidity}</h5>
                <h5>Wind Speed: ${data.daily[i].wind_speed} MPH</h5>
                <h5>UV Index: ${data.daily[i].uvi}</h5>
              </div>
            </div>
          </div>
        </div>`;
      }
    });
};

const displayWeather = function (cityName, temp, humidity, wind, uv) {
  document.getElementById("city").textContent = cityName;
  document.getElementById("temp").textContent = "Temperature: " + temp + " °F";
  document.getElementById("humidity").textContent =
    "Humidity: " + humidity + "%";
  document.getElementById("wind-speed").textContent =
    "Wind Speed: " + wind + " MPH";
  document.getElementById("uv-index").textContent = "UV Index: " + uv;
};

if (localStorage.getItem("city-search") === null) {
  localStorage.setItem("city-search", JSON.stringify([]));
}

displayCity();
document.getElementById("search").addEventListener("click", citySearch);
