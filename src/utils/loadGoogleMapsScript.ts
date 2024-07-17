export const loadGoogleMapsScript = (apiKey: string, callback: () => void) => {
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
  };
  