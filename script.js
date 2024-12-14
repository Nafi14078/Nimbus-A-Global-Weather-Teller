const geocodingURL = 'https://geocoding-api.open-meteo.com/v1/search?name=';
const weatherURL = 'https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true';

// Function to fetch weather data for a city
const getWeather = (latitude, longitude, cityName) => {
    const url = weatherURL.replace('{lat}', latitude).replace('{lon}', longitude);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const weather = data.current_weather;

            // Display weather info in the box
            document.getElementById('cityName').innerText = cityName;
            document.getElementById('temperature').innerText = weather.temperature;
            document.getElementById('windSpeed').innerText = weather.windspeed;
            document.getElementById('weatherCode').innerText = weather.weathercode;
            document.getElementById('weatherDescription').innerText = weather.weathercode === 0 ? 'Clear' : 'Cloudy'; // You can map the weather codes
           
        })
        .catch(err => console.error('Error fetching weather data:', err));
};

// Function to fetch city coordinates (latitude and longitude)
const getCityCoordinates = (city) => {
    fetch(geocodingURL + city)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                const { latitude, longitude, name } = data.results[0];
                getWeather(latitude, longitude, name);
            } else {
                alert('City not found. Please try again.');
            }
        })
        .catch(err => console.error('Error fetching city coordinates:', err));
};

// Event listener for the search button
document.getElementById('submit').addEventListener('click', (e) => {
    e.preventDefault();
    const city = document.getElementById('city').value.trim();
    if (city) getCityCoordinates(city);
});

// Predefined cities for the table
const cities = ['Dhaka', 'Rajshahi', 'Gazipur', 'Sylhet', 'Chattogram', 'Jamalpur'];

// Function to update the table for predefined cities
const updateCityTable = () => {
    const tableBody = document.getElementById('cityTableBody');
    tableBody.innerHTML = ''; // Clear the table first

    cities.forEach(city => {
        fetch(geocodingURL + city)
            .then(response => response.json())
            .then(data => {
                if (data.results && data.results.length > 0) {
                    const { latitude, longitude, name } = data.results[0];

                    // Fetch weather for the city
                    fetch(weatherURL.replace('{lat}', latitude).replace('{lon}', longitude))
                        .then(response => response.json())
                        .then(data => {
                            const weather = data.current_weather;

                            // Add a row to the table with weather description and humidity
                            const row = `
                                <tr>
                                    <td>${name}</td>
                                    <td>${weather.temperature}</td>
                                    <td>${weather.windspeed}</td>
                                    <td>${weather.weathercode}</td>
                                    <td>${weather.weathercode === 0 ? 'Clear' : 'Cloudy'}</td> <!-- Simple mapping -->
                                   
                                </tr>
                            `;
                            tableBody.insertAdjacentHTML('beforeend', row);
                        });
                }
            })
            .catch(err => console.error(`Error fetching data for ${city}:`, err));
    });
};

// Load the table on page load
updateCityTable();
