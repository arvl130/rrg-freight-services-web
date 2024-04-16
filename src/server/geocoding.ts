import { serverEnv } from "@/server/env.mjs"
import { Client } from "@googlemaps/google-maps-services-js"

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
