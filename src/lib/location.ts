export interface UserLocation {
  city: string;
  latitude: number;
  longitude: number;
}

const CACHE_KEY = 'flora-location';

/**
 * Requests the user's location, falling back to cached data when available.
 */
export async function getLocation(): Promise<UserLocation | null> {
  if (typeof window === 'undefined') return null;

  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached) as UserLocation;
    } catch {
      // ignore parse errors and fall back to fresh lookup
    }
  }

  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject)
    );
    const { latitude, longitude } = position.coords;
    let city = '';
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=en`
      );
      if (res.ok) {
        const json = await res.json();
        city = json?.results?.[0]?.name ?? '';
      }
    } catch {
      // ignore network errors
    }
    const loc: UserLocation = { city, latitude, longitude };
    localStorage.setItem(CACHE_KEY, JSON.stringify(loc));
    return loc;
  } catch {
    return null;
  }
}
