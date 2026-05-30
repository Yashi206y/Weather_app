const apiKey = "ndzzPBOD32zabcR0EhIYgCr6cDnDUyQt";

function getWeatherByCity() {
    const city = document.getElementById("locationInput").value.trim();
    if (city) {
        fetchWeatherData(city);
    } else {
        alert("Please enter a city name.");
    }
}

function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      fetchWeatherData(`${lat},${lon}`);
    }, () => {
      alert("Could not get your location.");
    });
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}

function fetchWeatherData(locationQuery) {
  const url = `https://api.tomorrow.io/v4/weather/realtime?location=${encodeURIComponent(locationQuery)}&apikey=${apiKey}`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      return response.json();
    })
    .then(data => {
      console.log("Weather data:", data);
      showWeather(locationQuery, data);
    })
    .catch(error => {
      console.error("Fetch error:", error);
      document.getElementById("weatherDisplay").innerHTML =
        "<p>Unable to fetch weather data.</p>";
});
}

function showWeather(location, data) {
  const display = document.getElementById("weatherDisplay");

  const values = data.data.values;
  const temperature = values.temperature;
  const wind = values.windSpeed;
  const humidity = values.humidity;
  const conditionCode = values.weatherCode;

  const weatherDescription = getWeatherDescription(conditionCode);
  const weatherIcon = getWeatherIcon(conditionCode);

  const html = `
    <h2>${location}</h2>
    <p>${weatherIcon} <strong>${weatherDescription}</strong></p>
    <p><strong>Temperature:</strong> ${temperature}°C</p>
    <p><strong>Humidity:</strong> ${humidity}%</p>
    <p><strong>Wind Speed:</strong> ${wind} m/s</p>
  `;

  display.innerHTML = html;
}

function getWeatherDescription(code) {
  const weatherCodes = {
    0: "Unknown",
    1000: "Clear",
    1100: "Mostly Clear",
    1101: "Partly Cloudy",
    1102: "Mostly Cloudy",
    1001: "Cloudy",
    2000: "Fog",
    2100: "Light Fog",
    4000: "Drizzle",
    4001: "Rain",
    4200: "Light Rain",
    4201: "Heavy Rain",
    5000: "Snow",
    5001: "Flurries",
    5100: "Light Snow",
    5101: "Heavy Snow",
    6000: "Freezing Drizzle",
    6001: "Freezing Rain",
    6200: "Light Freezing Rain",
    6201: "Heavy Freezing Rain",
    7000: "Ice Pellets",
    7101: "Heavy Ice Pellets",
    7102: "Light Ice Pellets",
    8000: "Thunderstorm"
  };
  return weatherCodes[code] || "Unknown";
}

function getWeatherIcon(code) {
  const icons = {
    1000: "☀️",
    1100: "🌤️",
    1101: "⛅",
    1102: "🌥️",
    1001: "☁️",
    2000: "🌫️",
    2100: "🌁",
    4000: "🌦️",
    4001: "🌧️",
    4200: "🌦️",
    4201: "🌧️",
    5000: "❄️",
    5001: "🌨️",
    5100: "🌨️",
    5101: "❄️",
    6000: "🌧️",
    6001: "🌧️",
    6200: "🌧️",
    6201: "🌧️",
    7000: "🌨️",
    7101: "❄️",
    7102: "🌨️",
    8000: "⛈️",
    0: "❓"
  };
  return icons[code] || "❓";
}
document.getElementById("locationInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        getWeatherByCity();
    }
});