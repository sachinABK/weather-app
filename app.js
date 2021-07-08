const timeEle = document.querySelector("#time");
const dateEle = document.querySelector("#date");
const currentWeatherItemsEle = document.querySelector(
  "#current__weather-items"
);
const timeZone = document.querySelector("#time__zone");
const countryEle = document.querySelector("#country");
const weatherForecastEle = document.querySelector("#weather__forecast");
const currentTempEle = document.querySelector("#current__temp");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const API_KEY = "dbc6d5facb42228df855de82183cc2c1";
const ADRESS_API_KEY = "c36ed52ed35940329a6202461d18686f";
setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hours = time.getHours();
  const timeFormat = hours >= 13 ? hours % 12 : hours;
  const minutes = time.getMinutes();
  const ampm = hours > 12 ? "PM" : "Am";
  const handleTimeFromat = timeFormat < 10 ? "0" + timeFormat : timeFormat;
  const handleMinutes = minutes < 10 ? "0" + minutes : minutes;
  timeEle.innerHTML =
    handleTimeFromat +
    ":" +
    handleMinutes +
    " " +
    `<span id="am-pm">${ampm}</span>`;

  dateEle.innerHTML = days[day] + "," + date + " " + months[month];
}, 1000);

const getWeatherData = () => {
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;
    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        showWeatherData(data);
      })
      .catch((err) => alert("Sorry, Weather report is not available", err));
    var requestOptions = {
      method: "GET",
    };

    fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${ADRESS_API_KEY}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        let { city, state, country } = result.features[0].properties;
        countryEle.innerHTML = `
        <span>${city},</span>
        <span>${state},</span>
        <span>${country}</span>
     `;
      })
      .catch((err) => alert(err));
  });
};

getWeatherData();

const showWeatherData = (data) => {
  let { humidity, pressure, sunrise, sunset, wind_speed, temp } = data?.current;
  timeZone.innerHTML = data.timezone;
  currentWeatherItemsEle.innerHTML = `
  <div class="other" id="current__weather-items">
      <div class="weather__items">
      <div class="weather__item">
          <div>Temp</div>
          <div>${temp} &#176;C</div>
        </div>
        <div class="weather__item">
          <div>Humidity</div>
          <div>${humidity}%</div>
        </div>
        <div class="weather__item">
          <div>Sun Rise</div>
          <div>${window.moment(sunrise * 1000).format("HH:MM ")}</div>
        </div>
        <div class="weather__item">
        <div>Sun Set</div>
        <div>${window.moment(sunset * 1000).format("HH:MM")}</div>
      </div>
      </div>
    </div>

`;
  let otherDayForcast = "";
  data.daily.forEach((day, idx) => {
    if (idx == 0) {
      currentTempEle.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${
              day.weather[0].icon
            }@2x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window
                  .moment(day.dt * 1000)
                  .format("dddd")}</div>
                  <div class="temp">Day - ${day.temp.day}&#176;C</div>
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
            </div>
            
            `;
    } else {
      otherDayForcast += `
            <div class="weather__forecast-item">
                <div class="day">${window
                  .moment(day.dt * 1000)
                  .format("dddd")}</div>
                <img src="http://openweathermap.org/img/wn/${
                  day.weather[0].icon
                }@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
            </div>
            
            `;
    }
  });

  weatherForecastEle.innerHTML = otherDayForcast;
};
