export interface ServiceLocation {
  city: string;
  area: string;
  tag: string;
  lat?: number;
  lng?: number;
}

export const DEFAULT_LOCATION = 'Sector 62, Noida';

export const LOCATIONS: ServiceLocation[] = [
  { city: 'Delhi NCR', area: 'Sector 62, Noida', tag: '48 Verified Artisans • 15m Dispatch', lat: 28.6280, lng: 77.3649 },
  { city: 'Delhi NCR', area: 'DLF Phase 3, Gurgaon', tag: 'Fast 15m Hub', lat: 28.4900, lng: 77.0988 },
  { city: 'Delhi NCR', area: 'Saket, South Delhi', tag: 'Co-op Guild Hub', lat: 28.5244, lng: 77.2173 },
  { city: 'Bengaluru', area: 'Indiranagar 4th Block', tag: 'Cooperative Hub', lat: 12.9784, lng: 77.6408 },
  { city: 'Bengaluru', area: 'HSR Layout Sector 2', tag: 'High Density Zone', lat: 12.9121, lng: 77.6446 },
  { city: 'Mumbai', area: 'Andheri West', tag: 'Active Zone', lat: 19.1363, lng: 72.8277 },
];

/**
 * Calculates distance in kilometers between two latitude/longitude points using Haversine formula
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Finds the nearest supported AIDORA locality based on GPS coordinates
 */
export function findNearestLocation(lat: number, lng: number): ServiceLocation {
  let nearest = LOCATIONS[0];
  let minDistance = Infinity;

  for (const loc of LOCATIONS) {
    if (loc.lat !== undefined && loc.lng !== undefined) {
      const dist = calculateDistanceKm(lat, lng, loc.lat, loc.lng);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = loc;
      }
    }
  }

  return nearest;
}

