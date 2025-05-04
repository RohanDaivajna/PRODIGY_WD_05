// OpenWeatherMap API key (replace with your own API key)
const API_KEY = 'b2f8438e094f711cb497fb000733605f';

// Initialize the map
const map = L.map('map').setView([20, 0], 2); // Default view
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
}).addTo(map);

// Add a marker to the map
let marker;
map.on('click', function (e) {
    const { lat, lng } = e.latlng;
    if (marker) {
        map.removeLayer(marker);
    }
    marker = L.marker([lat, lng]).addTo(map);
    getWeatherByCoordinates(lat, lng);
});

// Fetch weather by input location
function getWeatherByInput() {
    const location = document.getElementById('locationInput').value;
    if (!location) {
        alert('Please enter a location');
        return;
    }
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`)
        .then(response => response.json())
        .then(data => updateWeatherInfo(data))
        .catch(error => console.error('Error fetching weather data:', error));
}

// Fetch weather by current location
function getWeatherByLocation() {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            getWeatherByCoordinates(latitude, longitude);
        },
        error => {
            console.error('Error getting location:', error);
            alert('Unable to retrieve your location');
        }
    );
}

// Fetch weather by coordinates
function getWeatherByCoordinates(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
        .then(response => response.json())
        .then(data => updateWeatherInfo(data))
        .catch(error => console.error('Error fetching weather data:', error));

    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
        .then(response => response.json())
        .then(data => updateForecast(data))
        .catch(error => console.error('Error fetching forecast data:', error));
}

// Update current weather information
function updateWeatherInfo(data) {
    const weatherInfo = document.getElementById('weatherInfo');
    weatherInfo.innerHTML = `
        <h2>Current Weather</h2>
        <p><strong>Location:</strong> ${data.name}</p>
        <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
        <p><strong>Weather:</strong> ${data.weather[0].description}</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
    `;
}

// Update 5-day forecast
function updateForecast(data) {
    const forecastCards = document.getElementById('forecastCards');
    forecastCards.innerHTML = ''; // Clear previous forecast

    // Debugging: Log the forecast data
    console.log('Forecast data:', data);

    const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00'));
    console.log('Filtered daily forecasts:', dailyForecasts);

    if (dailyForecasts.length === 0) {
        forecastCards.innerHTML = '<p>No forecast data available.</p>';
        return;
    }

    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt_txt).toLocaleDateString();
        const temp = forecast.main.temp;
        const description = forecast.weather[0].description;

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${date}</h3>
            <p><strong>Temp:</strong> ${temp}°C</p>
            <p><strong>Weather:</strong> ${description}</p>
        `;
        forecastCards.appendChild(card);
    });
}