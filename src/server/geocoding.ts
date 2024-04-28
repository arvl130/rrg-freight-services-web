import { serverEnv } from "@/server/env.mjs"
import { Client, TravelMode } from "@googlemaps/google-maps-services-js"
import type { Package } from "./db/entities"
import { getDistance } from "geolib"

export async function getLongitudeLatitudeWithMapbox(searchText: string) {
  const response = await fetch(
    `${
      serverEnv.MAPBOX_API_URL
    }/geocoding/v5/mapbox.places/${encodeURIComponent(
      searchText,
    )}.json?country=PH&limit=1&access_token=${serverEnv.MAPBOX_SECRET_KEY}`,
  )
  const json = await response.json()

  return {
    long: json.features[0].geometry.coordinates[0],
    lat: json.features[0].geometry.coordinates[1],
  } as {
    long: number
    lat: number
  }
}

const client = new Client({})

export async function getLongitudeLatitudeWithGoogle(searchText: string) {
  const response = await client.geocode({
    params: {
      key: serverEnv.GOOGLE_API_KEY,
      address: searchText,
    },
  })

  return {
    long: response.data.results[0].geometry.location.lng,
    lat: response.data.results[0].geometry.location.lat,
  } as {
    long: number
    lat: number
  }
}

export async function getLongitudeLatitudeWithGeoapify(searchText: string) {
  const response = await fetch(
    `${serverEnv.GEOAPIFY_API_URL}${encodeURI(
      searchText,
    )}&limit=1&format=json&apiKey=${serverEnv.GEOAPIFY_API_KEY}`,
  )

  const { results } = await response.json()
  return { lat: results[0].lat, long: results[0].lon } as {
    long: number
    lat: number
  }
}

export async function getPackagesWithDistanceFromOrigin(options: {
  packages: Package[]
  origin: {
    long: number
    lat: number
  }
}) {
  const packagesWithDistancePromises = options.packages.map(
    async (_package) => {
      const fullAddress = `${_package.receiverStreetAddress}, ${_package.receiverCity}, ${_package.receiverStateOrProvince}, Philippines`
      const { lat, long } = await getLongitudeLatitudeWithGoogle(fullAddress)

      return {
        ..._package,
        distance: getDistance(
          {
            longitude: options.origin.long,
            latitude: options.origin.lat,
          },
          {
            longitude: long,
            latitude: lat,
          },
        ),
      }
    },
  )

  return await Promise.all(packagesWithDistancePromises)
}

export async function getEstimatedTimeOfArrival(options: {
  source: { lat: number; long: number }
  destination: { lat: number; long: number }
}) {
  const result = await client.distancematrix({
    params: {
      key: serverEnv.GOOGLE_API_KEY,
      mode: TravelMode.driving,
      departure_time: new Date(),
      origins: [
        {
          lat: options.source.lat,
          lng: options.source.long,
        },
      ],
      destinations: [
        {
          lat: options.destination.lat,
          lng: options.destination.long,
        },
      ],
    },
  })

  return result.data.rows[0].elements[0].duration_in_traffic.text
}
