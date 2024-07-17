import React, { useState } from 'react';
import CurrentWeather from './Components/CurrentWeather';
import SevenDayForecast from './Components/SevenDayForecast';
import './Styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { famousPlaces } from './utils/famousPlaceCoodinates';

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

const getRandomPlace = () => {
  const randomIndex = Math.floor(Math.random() * famousPlaces.length);
  return famousPlaces[randomIndex];
};

const App: React.FC = () => {
  const randomPlace = getRandomPlace();
  const [lat, setLat] = useState<number>(randomPlace.lat);
  const [lon, setLon] = useState<number>(randomPlace.lon);
  const [error, setError] = useState<string | null>(null);

  const handleLocationChange = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your mobile browser. Weather from a random location will be displayed instead. Click the Get Location button to change random locations ");
      const newRandomPlace = getRandomPlace();
      setLat(newRandomPlace.lat);
      setLon(newRandomPlace.lon);
      updateInputs(newRandomPlace.lat, newRandomPlace.lon);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setLat(latitude);
        setLon(longitude);
        updateInputs(latitude, longitude);
      },
      (error) => {
        let errorMessage = "";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "User denied the request for Geolocation. Weather from a random location will be displayed instead. Click the Get Location button to change random locations ";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable. Weather from a random location will be displayed instead. Click the Get Location button to change random locations ";
            break;
          case error.TIMEOUT:
            errorMessage = "The request to get user location timed out. Weather from a random location will be displayed instead. Click the Get Location button to change random locations ";
            break;
          default:
            errorMessage = "An unknown error occurred. Weather from a random location will be displayed instead. Click the Get Location button to change random locations ";
            break;
        }
        setError(errorMessage);
        const newRandomPlace = getRandomPlace();
        setLat(newRandomPlace.lat);
        setLon(newRandomPlace.lon);
        updateInputs(newRandomPlace.lat, newRandomPlace.lon);
      }
    );
  };

  const updateInputs = (latitude: number, longitude: number) => {
    const latitudeInput = document.getElementById("latitude") as HTMLInputElement;
    const longitudeInput = document.getElementById("longitude") as HTMLInputElement;
    if (latitudeInput && longitudeInput) {
      latitudeInput.value = latitude.toFixed(6);
      longitudeInput.value = longitude.toFixed(6);
    }
  };

  return (
    <div className="appMainContainer">
      <div className="appTitleContainer">
        <h1 className="appMainTitle">TypeScript OpenWeather API</h1>
      </div>
      <form className="inlineForm">
        <label className="formLabel">
          Latitude:
          <input className="formInput" id="latitude" type="text" name="latitude" defaultValue={lat.toFixed(6)} />
        </label>
        <label className="formLabel">
          Longitude:
          <input className="formInput" id="longitude" type="text" name="longitude" defaultValue={lon.toFixed(6)} />
        </label>
        <button type="button" className="formButton" onClick={handleLocationChange}>Get Location</button>
      </form>
      {error && <p className="error">{error}</p>}
      <CurrentWeather lat={lat} lon={lon} />
      <SevenDayForecast lat={lat} lon={lon} />
    </div>
  );
};

export default App;
