declare global {
  interface Window {
    google: typeof google;
    initMap: (lat: number, lng: number) => void;
  }
}

export {};
  