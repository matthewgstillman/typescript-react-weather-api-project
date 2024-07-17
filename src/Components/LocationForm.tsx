import React, { useState } from 'react';

interface LocationFormProps {
  onLocationSubmit: (lat: number, lon: number) => void;
}

const LocationForm: React.FC<LocationFormProps> = ({ onLocationSubmit }) => {
  const [location, setLocation] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const apiKey = process.env.REACT_APP_GEOCODING_API_KEY;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${location}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log('Geocoding API response:', data);

      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        onLocationSubmit(lat, lng);
      } else {
        alert('Location not found. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      alert('Failed to fetch coordinates. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter location"
        required
      />
      <button type="submit">Get Weather</button>
    </form>
  );
};

export default LocationForm;
