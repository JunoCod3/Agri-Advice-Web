document.addEventListener("DOMContentLoaded", function () {
    const API_KEY = '49cc8c821cd2aff9af04c9f98c36eb74';

    const kelvinToCelsius = (kelvin) => {
        return kelvin - 273.15;
    };

    

    const fetchData = async (city) => {
        try {
            const currentWeatherResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
            );
            const currentWeatherData = await currentWeatherResponse.json();

            const dailyForecastResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/onecall?lat=${currentWeatherData.coord.lat}&lon=${currentWeatherData.coord.lon}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
            );
            const dailyForecastData = await dailyForecastResponse.json();

            if (currentWeatherData.cod && currentWeatherData.cod !== 200) {
                displayError(`Error: ${currentWeatherData.message}`);
                displayWeather({}, []);
            } else {
                displayError(null);
                displayWeather(currentWeatherData, dailyForecastData.daily.slice(1));
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
            displayError('Error fetching weather data. Please try again later.');
            displayWeather({}, []);
        }
    };

    const displayWeather = (currentWeather, dailyForecast) => {
        const cityInfo = document.getElementById('cityInfo');
        const currentWeatherDescription = document.getElementById('currentWeatherDescription');
        const currentIcon = document.getElementById('currentIcon');
        const currentTemperature = document.getElementById('currentTemperature');
        const dailyForecastContainer = document.getElementById('dailyForecast');

        cityInfo.textContent = currentWeather.name ? `${currentWeather.name}, ${currentWeather.sys && currentWeather.sys.country}` : '';
        currentIcon.src = `http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`;
        currentWeatherDescription.textContent = currentWeather.weather && currentWeather.weather[0] && currentWeather.weather[0].description || '';
        currentTemperature.textContent = currentWeather.main ? `Current Temperature: ${kelvinToCelsius(currentWeather.main.temp).toFixed(2)}°C` : '';

        dailyForecastContainer.innerHTML = '';
        dailyForecast.forEach((day, idx) => {
            const dayOfWeek = moment(day.dt * 1000).format('dddd').toLowerCase();
            const dailyForecastItem = document.createElement('div');
            dailyForecastItem.className = `daily-forecast-itemm ${dayOfWeek}`;
            dailyForecastItem.innerHTML = `<h4>${moment(day.dt * 1000).format('dddd')}</h4>
                                            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-iconn" />
                                            <p>Night - ${day.temp.night}&#176;C</p>
                                            <p>Day - ${day.temp.day}&#176;C</p>`;
            dailyForecastContainer.appendChild(dailyForecastItem);
        });
    };

    const displayError = (error) => {
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = error || '';
    };

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        const cityInput = document.getElementById('cityInput');
        const city = cityInput.value.trim();
        if (city) {
            fetchData(city);
        } else {
            displayError('Please enter a city.');
            displayWeather({}, []);
        }
    };

    const weatherForm = document.getElementById('weatherForm');
    weatherForm.addEventListener('submit', handleSearchSubmit);

    handleSearchSubmit();
});

function logoutUser() {
    firebase.auth().signOut().then(() => {
        alert("Logout successful!");
        window.location.href = "index.html"; 
    }).catch((error) => {
        alert("Logout failed: " + error.message);
    });
}

document.getElementById("logoutButton").addEventListener("click", function () {
    logoutUser();
});

function preventBack() {
    history.pushState(null, document.title, location.href);
    window.addEventListener('popstate', function () {
      history.pushState(null, document.title, location.href);
    });
  }
  
  window.onload = function() {
    preventBack();
  }

