function getWeather() {
    const apiKey = '446b24906db446518f375b3f274cc49b';
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const timeZoneDiv = document.getElementById('time-zone');
    const localTimeDiv = document.getElementById('local-time');
    const preventionDiv = document.createElement('div');
    preventionDiv.id = 'prevention';

    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';
    timeZoneDiv.innerHTML = '';
    localTimeDiv.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); // Convert to Celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        const timeZoneOffset = data.timezone;
        const timeZone = convertTimeZoneOffset(timeZoneOffset);
        const localTime = getLocalTime(timeZoneOffset);

        const temperatureHTML = `
            <p>${temperature}°C</p>
        `;

        const weatherHtml = `
            <p>${cityName}</p>
            <p>${description}</p>
        `;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;
        timeZoneDiv.innerHTML = `<p>Time Zone: ${timeZone}</p>`;
        localTimeDiv.innerHTML = `<p>Local Time: ${localTime}</p>`;

        // Display prevention recommendations based on weather type and temperature
        const weatherType = data.weather[0].main;
        preventionDiv.innerHTML = getPreventionTips(weatherType, temperature);
        weatherInfoDiv.appendChild(preventionDiv);
    }

    showImage();
}
function convertTimeZoneOffset(offset) {
    const hours = Math.floor(offset / 3600);
    const minutes = Math.floor((offset % 3600) / 60);
    const formattedHours = hours >= 0 ? `+${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `UTC${formattedHours}:${formattedMinutes}`;
}

function getLocalTime(offset) {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 6000);
    const localTime = new Date(utc + (offset * 1000));
    return localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getPreventionTips(weatherType, temperature) {
    let preventionTips = '';

    switch (weatherType) {
        case 'Clear':
            preventionTips = `
                <h5>Prevention Tips:</h5>
                <ul>
                    <li>Wear sunscreen and a hat when going outside.</li>
                    <li>Stay hydrated and drink plenty of water.</li>
                </ul>
            `;
            break;
            case 'Mist':
            preventionTips = `
                <h5>Prevention Tips:</h5>
                <ul>
                    <li>Low Visibility! Be careful while driving .</li>
                </ul>
            `;
            break;
        case 'Clouds':
            preventionTips = `
                <h5>Prevention Tips:</h5>
                <ul>
                    <li>Bring an umbrella or wear a light jacket.</li>
                </ul>
            `;
            break;
        case 'Rain':
            preventionTips = `
                <h5>Prevention Tips:</h5>
                <ul>
                    <li>Wear a raincoat or bring an umbrella.</li>
                    <li>Avoid standing water to prevent slipping.</li>
                </ul>
            `;
            break;
        case 'Snow':
            if (temperature < 0) {
                preventionTips = `
                    <h5>Prevention Tips:</h5>
                    <ul>
                        <li>Wear warm clothing, such as a coat, gloves, and a hat.</li>
                        <li>Be cautious of slippery surfaces.</li>
                    </ul>
                `;
            } else {
                preventionTips = `
                    <h5>Prevention Tips:</h5>
                    <ul>
                        <li>Wear layers of clothing to keep warm.</li>
                        <li>Cover exposed skin to prevent frostbite.</li>
                    </ul>
                `;
            }
            break;
        case 'Haze':
            preventionTips = `
                <h5>Prevention Tips:</h5>
                <ul>
                    <li>Low Visibility! Be careful while driving .</li>
                    <li>Wear mask to prevent from dust .</li>
                </ul>
            `;
            break;
        case 'Thunderstorm':
            preventionTips = `
                <h5>Prevention Tips:</h5>
                <ul>
                    <li>Seek shelter indoors and avoid open areas.</li>
                    <li>Stay away from tall objects and water.</li>
                </ul>
            `;
            break;
        default:
            preventionTips = '';
    }

    return preventionTips;
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    const next24Hours = hourlyData.slice(0, 8); // Display the next 24 hours (3-hour intervals)

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15); // Convert to Celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; // Make the image visible once it's loaded
}
