import { GeoLocation } from '@/types/location'
import { Category } from '@/types/category'

interface PlaceResult {
  name: string
  location: GeoLocation
  rating: number
  priceLevel: number
  distance: number
}

export class LocationService {
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours
  private cache: Map<string, { data: PlaceResult[], timestamp: number }> = new Map()

  constructor(
    private readonly googleMapsApiKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
  ) {}

  async findNearbyAlternatives(
    category: Category,
    userLocation: GeoLocation,
    radius: number = 5000 // 5km
  ): Promise<PlaceResult[]> {
    const cacheKey = this.generateCacheKey(category, userLocation, radius)
    const cached = this.cache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
        `location=${userLocation.latitude},${userLocation.longitude}&` +
        `radius=${radius}&` +
        `type=${this.mapCategoryToPlaceType(category)}&` +
        `key=${this.googleMapsApiKey}`
      )

      const data = await response.json()
      const results = this.processPlaceResults(data.results, userLocation)
      
      // Cache the results
      this.cache.set(cacheKey, {
        data: results,
        timestamp: Date.now()
      })

      return results
    } catch (error) {
      console.error('Error fetching nearby places:', error)
      return []
    }
  }

  private generateCacheKey(
    category: Category,
    location: GeoLocation,
    radius: number
  ): string {
    return `${category}-${location.latitude.toFixed(2)}-${location.longitude.toFixed(2)}-${radius}`
  }

  private mapCategoryToPlaceType(category: Category): string {
    const categoryMapping = {
      groceries: 'supermarket',
      dining: 'restaurant',
      shopping: 'shopping_mall',
      entertainment: 'movie_theater'
    }

    return categoryMapping[category.toLowerCase()] || category
  }

  private processPlaceResults(
    results: any[],
    userLocation: GeoLocation
  ): PlaceResult[] {
    return results
      .map(place => ({
        name: place.name,
        location: {
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng
        },
        rating: place.rating || 0,
        priceLevel: place.price_level || 0,
        distance: this.calculateDistance(
          userLocation,
          {
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng
          }
        )
      }))
      .sort((a, b) => a.distance - b.distance)
  }

  private calculateDistance(
    point1: GeoLocation,
    point2: GeoLocation
  ): number {
    const R = 6371 // Earth's radius in km
    const dLat = this.toRad(point2.latitude - point1.latitude)
    const dLon = this.toRad(point2.longitude - point1.longitude)
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(point1.latitude)) * 
      Math.cos(this.toRad(point2.latitude)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  private toRad(degrees: number): number {
    return degrees * Math.PI / 180
  }
} 