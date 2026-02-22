export interface LocationSuggestion {
    name: string
    lat: number
    lng: number
    category: 'landmark' | 'city' | 'nature'
    country: string
  }
  
  export const LOCATION_SUGGESTIONS: LocationSuggestion[] = [
    // Europe
    { name: "Eiffel Tower, Paris", lat: 48.8584, lng: 2.2945, category: 'landmark', country: 'France' },
    { name: "Colosseum, Rome", lat: 41.8902, lng: 12.4922, category: 'landmark', country: 'Italy' },
    { name: "Big Ben, London", lat: 51.5007, lng: -0.1246, category: 'landmark', country: 'UK' },
    { name: "Sagrada Familia, Barcelona", lat: 41.4036, lng: 2.1744, category: 'landmark', country: 'Spain' },
    { name: "Santorini, Greece", lat: 36.3932, lng: 25.4615, category: 'nature', country: 'Greece' },
    
    // Asia
    { name: "Taj Mahal, Agra", lat: 27.1751, lng: 78.0421, category: 'landmark', country: 'India' },
    { name: "Great Wall of China", lat: 40.4319, lng: 116.5704, category: 'landmark', country: 'China' },
    { name: "Mount Fuji, Japan", lat: 35.3606, lng: 138.7274, category: 'nature', country: 'Japan' },
    { name: "Angkor Wat, Cambodia", lat: 13.4125, lng: 103.8670, category: 'landmark', country: 'Cambodia' },
    { name: "Marina Bay Sands, Singapore", lat: 1.2834, lng: 103.8607, category: 'landmark', country: 'Singapore' },
    
    // Americas
    { name: "Statue of Liberty, New York", lat: 40.6892, lng: -74.0445, category: 'landmark', country: 'USA' },
    { name: "Golden Gate Bridge, San Francisco", lat: 37.8199, lng: -122.4783, category: 'landmark', country: 'USA' },
    { name: "Christ the Redeemer, Rio", lat: -22.9519, lng: -43.2105, category: 'landmark', country: 'Brazil' },
    { name: "Machu Picchu, Peru", lat: -13.1631, lng: -72.5450, category: 'landmark', country: 'Peru' },
    { name: "Niagara Falls", lat: 43.0799, lng: -79.0747, category: 'nature', country: 'Canada' },
    
    // Oceania
    { name: "Sydney Opera House", lat: -33.8568, lng: 151.2153, category: 'landmark', country: 'Australia' },
    { name: "Great Barrier Reef", lat: -18.2871, lng: 147.6992, category: 'nature', country: 'Australia' },
    
    // Africa  
    { name: "Pyramids of Giza, Egypt", lat: 29.9792, lng: 31.1342, category: 'landmark', country: 'Egypt' },
    { name: "Victoria Falls", lat: -17.9243, lng: 25.8572, category: 'nature', country: 'Zimbabwe' },
    { name: "Table Mountain, Cape Town", lat: -33.9628, lng: 18.4098, category: 'nature', country: 'South Africa' },
  ]
  
  export function getNearbyLocations(lat: number, lng: number, maxDistance: number = 100): LocationSuggestion[] {
    return LOCATION_SUGGESTIONS
      .map(location => {
        const distance = getDistance(lat, lng, location.lat, location.lng)
        return { ...location, distance }
      })
      .filter(location => location.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5)
  }
  
  function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371 // Earth's radius in km
    const dLat = toRad(lat2 - lat1)
    const dLng = toRad(lng2 - lng1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }
  
  function toRad(degrees: number): number {
    return degrees * (Math.PI / 180)
  }
  