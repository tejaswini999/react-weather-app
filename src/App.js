import { useState, useEffect, useRef } from "react";
import './App.css';

const weatherApi = {
  key: '788d5f827c953037191f1944d12abb31',
  base: 'https://api.openweathermap.org/data/2.5/',
  location: 'http://api.openweathermap.org/geo/1.0/'
}

function App() {

  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [coord, setCoord] = useState([]);
  const [place, setPlace] = useState([]);

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus()
  })

  const getDateFromTimestamp = (unixTimestamp) => {
    var date = new Date(unixTimestamp * 1000);
    return date;
  }

  useEffect(() => {
    const fetchApi = async () => {
      const result = await fetch(`${weatherApi.base}onecall?lat=${coord[0]}&lon=${coord[1]}&exclude=minutely&appid=${weatherApi.key}&units=metric`)
        .then(res => res.json())
      setWeather(result);
    }
    fetchApi()
  }, [coord])

  const setLocation = async (e) => {
    if (e.key === 'Enter') {
      const location = await fetch(`${weatherApi.location}direct?q=${query}&limit=5&appid=${weatherApi.key}`)
        .then(res => res.json())
      if (typeof (location[0]) != 'undefined') {
        setCoord([location[0].lat, location[0].lon])
        setPlace([location[0].name, location[0].state, location[0].country]);
      }
      else {
        setCoord([])
        setPlace([])
      }
    }
  }

  const dateBuilder = (d) => {
    let months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December']
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
      'Friday', 'Saturday'];

    let date = d.getDate();
    let day = days[d.getDay()];
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day}, ${date} ${month} ${year}`
  }

  const timeBuilder = (date) => {
    var hours = date.getHours();
    var minutes = date.getMinutes();

    return `${hours}:${minutes}`;
  }

  return (
    <div className="app">
      <input className="search-bar"
        type="search"
        placeholder="Type city"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyPress={setLocation}
        ref={inputRef}
      />
      {(typeof (weather.current) != 'undefined') ? (
        <div className="block">
          <div className="current-weather">
            <img alt="" src={`http://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`} />
            <div className="current-content">
              <div className="location">{place[0]}{place[0] ? (', ') : ''}{place[1]}{place[1] ? (', ') : ''}{place[2]}</div>
              <div className="date">{dateBuilder(new Date())}</div>
              <div className="temperature">
                {Math.round(weather.current.temp)}°C
              </div>
              <div className="weather">{weather.current.weather[0].main}</div>
            </div>
          </div>
          <h2>HOURLY FORECAST</h2>
          <p className="hourly-date">{dateBuilder(new Date())}</p>
          <div className="hourly-forecast">
            {weather.hourly.map(i =>
              <div className="hourly-content" key={i.dt}>
                {
                  (dateBuilder(getDateFromTimestamp(i.dt)) === dateBuilder(new Date())) ?
                    (
                      <li>
                        <div>{timeBuilder(getDateFromTimestamp(i.dt))}</div>
                        <img alt="" src={`http://openweathermap.org/img/wn/${i.weather[0].icon}@2x.png`} />
                        <div className="hourly-weather">{Math.round(i.temp)}°C</div>
                        <div className="hourly-weather-type">{i.weather[0].main}</div>
                      </li>
                    ) : ('')
                }
              </div>
            )}
          </div>
          <h2>DAILY FORECAST</h2>
          <div className="daily-forecast">
            {weather.daily.map(i =>
              <div key={i.dt}>
                {
                  (new Date(getDateFromTimestamp(i.dt).getFullYear(), getDateFromTimestamp(i.dt).getMonth(), getDateFromTimestamp(i.dt).getDate()) > new Date()) ?
                    (
                      <li>
                        <div>{dateBuilder(getDateFromTimestamp(i.dt)).split(', ')[0]}</div>
                        <div>{dateBuilder(getDateFromTimestamp(i.dt)).split(', ')[1]}</div>
                        <img alt="" src={`http://openweathermap.org/img/wn/${i.weather[0].icon}@2x.png`} />
                        <div className="daily-min">Min {Math.round(i.temp.min)}°C</div>
                        <div className="daily-max">Max {Math.round(i.temp.max)}°C</div>
                        <div className="daily-weather">{i.weather[0].main}</div>
                      </li>
                    ) : ('')
                }
              </div>

            )}
          </div>

        </div>
      ) : ((query !== '') ? (
        <div>Data not found</div>
      ) : ('')
      )
      }
    </div >
  );
}

export default App;
