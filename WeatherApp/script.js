const apikey = "f54f778b85e4976b5234352051529db2";

const main = document.getElementById("main");
const search = document.getElementById("search");
const form = document.getElementById("form");

// console.log('working');

const url = (city) =>
  `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;

//cross origin resource

async function getWeatherByLocation(city) {
  const resp = await fetch(url(city), { origin: "cors" });
  const respData = await resp.json();

//   console.log(respData);

  addWeatherToPage(respData);
}

function addWeatherToPage(data) {
  const temp = KtoC(data.main.temp);
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;

  const weather = document.createElement("div");
  weather.classList.add("weather");

  weather.innerHTML = `
  <h2><img src="https://api.openweathermap.org/img/wn/${
    data.weather[0].icon
  }@2x.png" /> ${temp}C <img src="https://api.openweathermap.org/img/wn/${
    data.weather[0].icon
  }@2x.png" /> </h2>
  <small>${data.weather[0].main}</small>
  <div class="more-info">
  <p>Humidity : <span>${humidity}%</span></p>
  <p>Wind Speed: <span>${+Math.trunc(windSpeed * 3.16)} km/h</span></p>
  </div>`;

  main.innerHTML = "";

  main.appendChild(weather);
}

function KtoC(K) {
  return Math.floor(K - 273.15);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const city = search.value;

  if (city) {
    getWeatherByLocation(city);
  }
});
