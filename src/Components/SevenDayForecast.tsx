import { useState, useEffect, FC } from 'react';
import '../Styles/App.css';
import { getIconUrl } from '../utils/weatherIcon';

interface WeatherForecastProps {
  lat: number;
  lon: number;
}

interface WeatherForecast {
  city: {
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    id: number;
    name: string;
    population: number;
    timezone: number;
  };
  cod: string;
  message: number;
  cnt: number;
  list: {
    clouds: { all: number };
    deg: number;
    dt: number;
    feels_like: {
      day: number;
      eve: number;
      morn: number;
      night: number;
    };
    gust: number;
    humidity: number;
    pop: number;
    pressure: number;
    speed: number;
    sunrise: number;
    sunset: number;
    temp: {
      day: number;
      eve: number;
      max: number;
      min: number;
      morn: number;
      night: number;
    };
    weather: {
      description: string;
      icon: string;
      id: number;
      main: string;
    }[];
  }[];
}

const SevenDayForecast: FC<WeatherForecastProps> = ({ lat, lon }) => {
  const [weatherData, setWeatherData] = useState<WeatherForecast | null>(null);
  const apiKey = process.env.REACT_APP_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&appid=${apiKey}&units=imperial`;

  const apiRequest = async () => {
    try {
      const response = await fetch(url);
      const data: WeatherForecast = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
     apiRequest();
  }, [lat, lon]);

  const convertUnixTimeStamp = (unix: number) => {
    let date = new Date(unix * 1000);
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let seconds = "0" + date.getSeconds();
    let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
  }

  return (
    <div className="sevenDayMainContainer">
      <h1 className="mainTitle">Seven Day Forecast</h1>
      {weatherData && (
        <div>
          <h2 className="cityTitle">{weatherData.city.name}</h2>
          <div className="forecastCardContainer">
            {weatherData.list.map((day, index) => (
              <div className="forecastCard" key={index}>
                <div className="weatherCardBody">
                  <div className="cardTitle">{new Date(day.dt * 1000).toLocaleDateString()}</div>
                  <div className="cardText">
                    <div className="weatherIconImage">
                      <img src={getIconUrl(day.weather[0].id, true)} alt={`${day.weather[0].description} icon`} />
                    </div>
                    <div>High: {day.temp.max} °F</div>
                    <div>Low: {day.temp.min} °F</div>
                    <div>Weather: {day.weather[0].description}</div>
                    <div>Humidity: {day.humidity}%</div>
                    <div>Wind Speed: {day.speed} mph</div>
                    <div>Sunrise: {convertUnixTimeStamp(day.sunrise)} AM</div>
                    <div>Sunset: {convertUnixTimeStamp(day.sunset)} PM</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );  
}

export default SevenDayForecast;
