/**
 * AIDORA Cooperative Platform - Geolocation & Distance Calculation Service
 * 
 * Provides true Haversine distance computations, browser GPS geolocation,
 * and geographic zone coordinates for intelligent artisan matching.
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export const ZONE_COORDINATES: Record<string, Coordinates> = {
  'indiranagar': { lat: 12.9716, lng: 77.6412 },
  'koramangala': { lat: 12.9352, lng: 77.6245 },
  'hsr layout': { lat: 12.9121, lng: 77.6446 },
  'hsr': { lat: 12.9121, lng: 77.6446 },
  'whitefield': { lat: 12.9698, lng: 77.7499 },
  'jayanagar': { lat: 12.9308, lng: 77.5838 },
  'domlur': { lat: 12.9609, lng: 77.6387 },
  'marathahalli': { lat: 12.9591, lng: 77.6974 },
  'electronic city': { lat: 12.8452, lng: 77.6602 },
  'malleshwaram': { lat: 13.0031, lng: 77.5643 },
  'hebbal': { lat: 13.0358, lng: 77.5970 },
  'default': { lat: 12.9716, lng: 77.6412 },
};

/**
 * Calculates true Haversine distance between two coordinates in Kilometers
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in KM
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Resolves coordinates for a location string
 */
export function getCoordinatesForLocation(locationName: string): Coordinates {
  const clean = (locationName || '').toLowerCase();
  for (const [zone, coords] of Object.entries(ZONE_COORDINATES)) {
    if (clean.includes(zone)) {
      return coords;
    }
  }
  return ZONE_COORDINATES['default'];
}

/**
 * Retrieves the user's live browser GPS coordinates or falls back to selected location coordinates
 */
export async function getLiveUserCoordinates(selectedLocationName: string): Promise<Coordinates> {
  return new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          resolve(getCoordinatesForLocation(selectedLocationName));
        },
        { timeout: 3500 }
      );
    } else {
      resolve(getCoordinatesForLocation(selectedLocationName));
    }
  });
}
