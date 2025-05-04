const apiKey = 'b2f8438e094f711cb497fb000733605f'; // Replace with your OpenWeatherMap API key

async function fetchWeatherData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        document.getElementById('weatherInfo').innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

function displayWeather(data) {
    const weatherInfo = `
        <h2>Weather in ${data.name}</h2>
        <p><strong>Temperature:</strong> ${(data.main.temp - 273.15).toFixed(1)}°C</p>
        <p><strong>Condition:</strong> ${data.weather[0].description}</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
    `;
    document.getElementById('weatherInfo').innerHTML = weatherInfo;
}

function getWeatherByInput() {
    const location = document.getElementById('locationInput').value;
    if (!location) {
        alert('Please enter a location');
        return;
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
    fetchWeatherData(url);
}

function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
            fetchWeatherData(url);
        }, () => {
            alert('Unable to retrieve your location');
        });
    } else {
        alert('Geolocation is not supported by your browser');
    }
}

// Initialize the map
const map = L.map('map').setView([51.505, -0.09], 5); // Default view

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Add a marker on click and fetch weather data
map.on('click', function (e) {
    const { lat, lng } = e.latlng;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}`;
    fetchWeatherData(url);

    // Add a marker to the map
    L.marker([lat, lng]).addTo(map)
        .bindPopup(`Selected Location: ${lat.toFixed(2)}, ${lng.toFixed(2)}`)
        .openPopup();
});