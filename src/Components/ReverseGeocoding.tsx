import { useState, useEffect, FC } from 'react';
import '../Styles/App.css';

interface CoordinatesAndCityInfo {
    lat: number;
    lon: number;
    name?: string;
    city?: string;
    country?: string;
    address_line1?: string;
    address_line2?: string;
    district?: string;
    street?: string;
    housenumber?: string;
    state_code?: string;
    postcode?: string;
    formatted?: string;
}

const ReverseGeocoding: FC<CoordinatesAndCityInfo> = ({ lat, lon }) => {
    const [coordinatesAndInfo, setCoordinatesAndInfo] = useState<CoordinatesAndCityInfo | null>(null);
    const apiKey = process.env.REACT_APP_REVERSE_GEOCODING_API_KEY;
    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${apiKey}`;

    const apiRequest = async () => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            const result = data.results[0];
            setCoordinatesAndInfo(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        apiRequest();
    }, [lat, lon]);

    return (
        <div>
            {coordinatesAndInfo && (
                <div>
                    {coordinatesAndInfo.city && coordinatesAndInfo.state_code && coordinatesAndInfo.district && (
                        <p><strong>{coordinatesAndInfo.city}, {coordinatesAndInfo.state_code} - {coordinatesAndInfo.district} </strong></p>
                    )}
                    {coordinatesAndInfo.address_line1 && (
                        <p><strong></strong> {coordinatesAndInfo.address_line1}<br></br>{coordinatesAndInfo.address_line2}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReverseGeocoding;

