export interface LocationResult {
  latitude: number;
  longitude: number;
  mapsLink: string;
}

export const getCurrentLocation = async (): Promise<LocationResult> => {
  // Check if running on native platform (Capacitor)
  if (window.Capacitor && window.Capacitor.isNativePlatform()) {
    try {
      const { Geolocation } = await import('@capacitor/geolocation');
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 3000, // Accept cached location up to 3 seconds old
      });
      
      const { latitude, longitude } = position.coords;
      return {
        latitude,
        longitude,
        mapsLink: `https://www.google.com/maps?q=${latitude},${longitude}`,
      };
    } catch (error: any) {
      // Handle Capacitor specific errors
      if (error.message?.includes('permission')) {
        throw new Error("Location permission required to send SOS. Please enable location permissions in Settings.");
      } else if (error.message?.includes('Location services are disabled')) {
        throw new Error("Please enable location services on your device to use SOS.");
      } else {
        throw new Error("Unable to get location. Please check your location settings.");
      }
    }
  }
  
  // Fallback to browser geolocation for web
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported on this device"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({
          latitude,
          longitude,
          mapsLink: `https://www.google.com/maps?q=${latitude},${longitude}`,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error("Location permission required to send SOS"));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error("Location information unavailable"));
            break;
          case error.TIMEOUT:
            reject(new Error("Location request timed out"));
            break;
          default:
            reject(new Error("Failed to get location"));
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
};
