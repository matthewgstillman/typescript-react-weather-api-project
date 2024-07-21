import { useState, useEffect } from 'react';
import '../Styles/App.css';
import { getIconUrl } from '../utils/weatherIcon';
import ReverseGeocoding from './ReverseGeocoding';

interface WeatherResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
    sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

interface CurrentWeatherProps {
  lat: number;
  lon: number;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ lat, lon }) => {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const apiKey = process.env.REACT_APP_API_KEY;
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

  const apiRequest = async () => {
    try {
      const response = await fetch(url);
      const data: WeatherResponse = await response.json();
      setWeatherData(data);
      loadGoogleMapsScript(googleMapsApiKey, () => initMap(lat, lon));
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
    let period = "AM";
  
    if (hours >= 12) {
      period = "PM";
      if (hours > 12) {
        hours -= 12;
      }
    } else if (hours === 0) {
      hours = 12;
    }
  
    let formattedTime = hours + ':' + minutes.substr(-2) + ' ' + period;
    return formattedTime;
  }  

  const loadGoogleMapsScript = (apiKey: string, callback: () => void) => {
    const existingScript = document.getElementById('googleMapsScript');
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
      script.id = 'googleMapsScript';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      
      script.onload = () => {
        if (callback) callback();
      };
    } else {
      if (callback) callback();
    }
  }

  const initMap = (lat: number, lng: number) => {
    const myLatLng = { lat, lng };
  
    if (!window.google) {
      console.error('Google Maps JavaScript API not loaded!');
      return;
    }
  
    const map = new window.google.maps.Map(document.getElementById("map") as HTMLElement, {
      zoom: 20,
      center: myLatLng,
      mapTypeId: window.google.maps.MapTypeId.SATELLITE,
    });
  
    new window.google.maps.Marker({
      position: myLatLng,
      map,
      title: "Current Location",
    });
  };
  

  useEffect(() => {
    window.initMap = () => initMap(lat, lon);
  }, [lat, lon]);

  return (
    <div className="currentWeatherContainer">
      <h1 className="weatherCardHeader">Current Weather</h1>
      {weatherData && (
        <div>
          <h2 className="cityTitle">{weatherData.name}</h2>
          <div id="map"></div>
          <div className="currentWeatherCardContainer">
            <div className="currentWeatherCard">
              <div className="weatherCardBody">
                <ReverseGeocoding lat={lat} lon={lon}/>
                <div className="cardText">
                  <div className="weatherIconImage">
                      <img src={getIconUrl(weatherData.weather[0].id, true)} alt={`${weatherData.weather[0].description} icon`} />
                  </div>
                  <div>Temperature: {weatherData.main.temp}°F</div>
                  <div>Weather: {weatherData.weather[0].description}</div>
                  <div>Feels like: {weatherData.main.feels_like}°F</div>
                  <div>High: {weatherData.main.temp_max}°F</div>
                  <div>Low: {weatherData.main.temp_min}°F</div>
                  <div>Humidity: {weatherData.main.humidity}%</div>
                  <div>Wind: {weatherData.wind.speed} MPH</div>
                  <div>Sunrise: {convertUnixTimeStamp(weatherData.sys.sunrise)}</div>
                  <div>Sunset: {convertUnixTimeStamp(weatherData.sys.sunset)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CurrentWeather;
