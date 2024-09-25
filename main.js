function handleGetWeather(event) {
    if (event) {
        event.preventDefault();
    }

    const result_frame = document.getElementById("result-weather");
    const city = document.getElementById("city").value;
    console.log(city);

    const url = "http://api.weatherapi.com/v1";
    const api_key = API_KEY;

    const request = new Request(`${url}/current.json?key=${api_key}&q=${city}`);
    const requestForecast = new Request(`${url}/forecast.json?key=${api_key}&q=${city}&days=1`);


    // Fetch forecast data
    const fetchForecast = fetch(requestForecast)
        .then(response => {
            if (!response.ok) {
                throw new Error("Forecast API request error");
            }
            return response.json();
        })
        .then(data => {
            const currentHour = new Date().getHours();

            // Used for the filter function, I got tired of changing it manuallly
            const indexSlice = 4
            const moduloHour = 4
            return data.forecast.forecastday[0].hour.filter((entry, index) => index >= currentHour && (index - currentHour) % moduloHour === 0).slice(0, indexSlice); // Start from current hour and get every 8th hourly entry, limit to 3 entries
        });

    // Fetch current weather data
    fetch(request)
        .then(response => {
            if (!response.ok) {
                throw new Error("Main API request error");
            }
            return response.json();
        })
        .then(data => {
            const weather = data.current;
            const location = data.location;

            console.log("WEATHER DATA: " + JSON.stringify(data, null, 2));
            

            // Wait for the forecast data to be fetched
            fetchForecast.then(forecastData => {
                let forecastHTML = "";

                forecastData.forEach(entry => {

                    const entryDate = new Date(entry.time);
                    const options = { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
                    const formattedDate = entryDate.toLocaleString(undefined, options);

                    // Determine background color based on temperature
                    let bgColor;
                    console.log(entry.temp_c);
                    
                    if (entry.temp_c < -10) {
                        bgColor = "linear-gradient(to bottom, #0000ff, #ffffff)"; // Very cold
                    } else if (entry.temp_c < -5) {
                        bgColor = "linear-gradient(to bottom, #0033ff, #ffffff)"; // Cold
                    } else if (entry.temp_c < 0) {
                        bgColor = "linear-gradient(to bottom, #0066ff, #ffffff)"; // Cold
                    } else if (entry.temp_c < 5) {
                        bgColor = "linear-gradient(to bottom, #0099ff, #ffffff)"; // Cool
                    } else if (entry.temp_c < 10) {
                        bgColor = "linear-gradient(to bottom, #00ccff, #ffffff)"; // Cool
                    } else if (entry.temp_c < 15) {
                        bgColor = "linear-gradient(to bottom, #00ffff, #ffffff)"; // Mild
                    } else if (entry.temp_c < 20) {
                        bgColor = "linear-gradient(to bottom, #ffff00, #ffffff)"; // Mild
                    } else if (entry.temp_c < 25) {
                        bgColor = "linear-gradient(to bottom, #ffcc00, #ffffff)"; // Warm
                    } else if (entry.temp_c < 30) {
                        bgColor = "linear-gradient(to bottom, #ff6600, #ffffff)"; // Warm
                    } else {
                        bgColor = "linear-gradient(to bottom, #ff0000, #ffffff)"; // Hot
                    }

                    forecastHTML += `
                        <div class="forecast-entry" style="background: ${bgColor}">
                        <img src="${entry.condition.icon}" alt="${entry.condition.text}">
                            <h4>${formattedDate}</h4>
                            <div id="forecast-temp-container"
                                <i class="fa-solid fa-temperature-low "></i>
                                <h2> ${entry.temp_c} °C</h2>
                            </div
                            <h4>${entry.condition.text}</h4>
                        </div>
                    `;
                });

                const requestCountryCode = new Request(`https://restcountries.com/v3.1/name/${location.country}`)

    

                fetch(requestCountryCode)
                .then(response => {
                    if(!response.ok){
                        throw new Error("Can't get country code")
                    }
                    return response.json()
                })
                .then(countryData =>{
                    console.log(countryData[0].cca2);
                    const countryCode = countryData[0].cca2.toLowerCase();
                    const flagURL = `https://flagcdn.com/80x60/${countryCode}.png`
                    console.log("FLAG URL: " + flagURL);

                    result_frame.innerHTML = `
                        <div id="country-flag-container">
                            <div id="country-and-flag"> 
                                <img src="${flagURL}" />
                                <h1 id="countryName" style="color: black; font-size:3rem; margin: 0px">  ${location.country}  </h1>
                                <img src="${flagURL}" />
                            </div>
                            <h2 id="result-city-name" style="color: black; margin: 0px;">  ${location.name}</h2>
                        </div>
                        <div id="result-icon-container">
                            <img id="result-icon" src="${weather.condition.icon}" alt="${weather.condition.text}">
                        </div>
                        <div id="full-weather-container">
                            <div id="weather-temp-container">
                                <i class="fa-solid fa-temperature-low fa-7x"></i>
                                <h1 id="weather-temp"> ${weather.temp_c} °C  </h1>
                                <h3> ${weather.condition.text} </h3>
                            </div>
                            <div id="result-row-1"> 
                                <div id="result-row-col">
                                    <div class="stat-item">
                                        <i class="fa-solid fa-droplet"></i>
                                        <h2>Humidity</h2>
                                    </div>
                                    <h3> ${weather.humidity}%</h3>
                                </div>
                                <div id="result-row-col">
                                    <div class="stat-item">
                                        <i class="fa-solid fa-wind"></i>
                                        <h2>Wind</h2>
                                    </div>
                                    <h3> ${weather.wind_kph} kph</h3>
                                </div>
                                <div id="result-row-col">
                                    <div class="stat-item">
                                        <i class="fa-solid fa-arrows-down-to-line"></i>
                                        <h2>Pressure</h2>
                                    </div>
                                    <h3> ${weather.pressure_mb} mb</h3>
                                </div>
                                <div id="result-row-col">
                                    <div class="stat-item">
                                        <i class="fa-regular fa-eye"></i>
                                        <h2>Visibility</h2>
                                    </div>
                                    <h3> ${weather.vis_km} km</h3>
                                </div>
                            </div>
                        </div>
                        <div id="result-row-2">
                            <h2 id="flex-title">12  -Hour Forecast</h2>
                            ${forecastHTML}
                        </div>
                        `;                
                })

                result_frame.classList.add('padding-20');
                result_frame.classList.add('margin-20');

                document.getElementById('animated-weather').remove();

            });
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            result_frame.innerHTML = `<p>Error fetching weather data. Please try again later.</p>`;
        });
}
 