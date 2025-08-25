export type UserLocation = {
  city: string;
  lat: number;
  lon: number;
};

const LOCATION_KEY = 'flora.location';

export async function getLocation(): Promise<UserLocation | null> {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    return null;
  }

  const cached = localStorage.getItem(LOCATION_KEY);
  if (cached) {
    try {
      return JSON.parse(cached) as UserLocation;
    } catch {
      localStorage.removeItem(LOCATION_KEY);
    }
  }

  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    const { latitude, longitude } = position.coords;

    let city = '';
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&count=1`
      );
      if (res.ok) {
        const json = await res.json();
        city = json?.results?.[0]?.name ?? '';
      }
    } catch {
      // ignore geocoding errors
    }

    const location: UserLocation = { city, lat: latitude, lon: longitude };
    localStorage.setItem(LOCATION_KEY, JSON.stringify(location));
    return location;
  } catch {
    return null;
  }
}
