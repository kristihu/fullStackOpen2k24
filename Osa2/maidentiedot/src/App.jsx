import { useState, useEffect } from 'react';

function App() {
  const [countries, setCountries] = useState([]);
  const [searchParam, setSearchParam] = useState('');
  const [country, setCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  const handleSearchChange = event => {
    const searchValue = event.target.value;
    setSearchParam(searchValue);
    setCountry(null);
    const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(searchValue.toLowerCase()));

    if (filteredCountries.length === 1) {
      fetchWeather(filteredCountries[0].capital);
    } else {
      setWeather(null);
    }
  };

  const apiUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all';
  const apiKey = import.meta.env.VITE_APIKEY;
  const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  useEffect(() => {
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        setCountries(data);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
      });
  }, []);

  useEffect(() => {
    if (country) {
      fetchWeather(country.capital);
    }
  }, [country]);

  const fetchWeather = capital => {
    fetch(`${weatherApiUrl}?q=${capital}&appid=${apiKey}&units=metric`)
      .then(response => {
        return response.json();
      })
      .then(weatherData => {
        setWeather(weatherData);
        console.log(weatherData);
      })
      .catch(error => {
        console.error('Error fetching weather:', error);
      });
  };

  const filteredCountries = countries.filter(country => {
    return country.name.common.toLowerCase().includes(searchParam.toLowerCase());
  });

  useEffect(() => {
    if (filteredCountries.length === 1) {
      fetchWeather(filteredCountries[0].capital);
    } else {
      setWeather(null);
    }
  }, [country]);
  const handleShow = country => {
    setCountry(country);
  };

  return (
    <>
      <p>Find countries by name</p>
      <input type="text" onChange={handleSearchChange} value={searchParam} />
      {filteredCountries.length > 10 && <p>specify more there are too many matches</p>}
      {(filteredCountries.length === 1 || country) && (
        <div>
          <h2>{country ? country.name.common : filteredCountries[0].name.common}</h2>
          <p>Capital: {country ? country.capital[0] : filteredCountries[0].capital}</p>
          <p>Area: {country ? country.area : filteredCountries[0].area}</p>
          <p>Region: {country ? country.region : filteredCountries[0].region}</p>
          <h2>Languages:</h2>
          <ul>
            {Object.values(country ? country.languages : filteredCountries[0].languages).map((language, index) => (
              <li key={index}>
                <p>{language}</p>
              </li>
            ))}
          </ul>
          <img src={country ? country.flags.png : filteredCountries[0].flags.png} alt={`Flag of ${country ? country.name.common : filteredCountries[0].name.common}`} />
          {weather && (
            <div>
              <h2>Weather in {country ? country.capital[0] : filteredCountries[0].capital}</h2>
              <p>Temperature: {weather.main.temp}°C</p>
              <p>Description: {weather.weather[0].description}</p>
              <p>Wind: {weather.wind.speed} m/s</p>
              <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt="Weather icon" />
            </div>
          )}
        </div>
      )}
      {filteredCountries.length <= 10 &&
        filteredCountries.length !== 1 &&
        filteredCountries.map(country => (
          <p key={country.cca3}>
            {country.name.common} <button onClick={() => handleShow(country)}>shown</button>
          </p>
        ))}
    </>
  );
}

export default App;
