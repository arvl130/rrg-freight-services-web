import { MapContainer } from "react-leaflet/MapContainer"
import { TileLayer } from "react-leaflet/TileLayer"
import { Marker } from "react-leaflet/Marker"
import { Popup } from "react-leaflet/Popup"
import "@/styles/leaflet/leaflet.css"
import type { Map } from "leaflet"
import { Icon, featureGroup, marker } from "leaflet"
import { useMap } from "react-leaflet/hooks"
import { useEffect } from "react"
import { LEAFLET_DEFAULT_ZOOM_LEVEL } from "@/utils/constants"

function RecenterAutomatically({
  lat,
  long,
  destination,
}: {
  lat: number
  long: number
  destination?: {
    lat: number
    long: number
  }
}) {
  const map = useMap()

  useEffect(() => {
    if (destination) {
      const markers = [
        marker([lat, long]),
        marker([destination.lat, destination.long]),
      ]
      const group = featureGroup(markers)
      map.fitBounds(group.getBounds())
    } else {
      map.flyTo([lat, long], LEAFLET_DEFAULT_ZOOM_LEVEL)
    }
  }, [destination, lat, long, map])

  return <></>
}

export default function BareMap({
  lat,
  long,
  destination,
  setMap,
}: {
  lat: number
  long: number
  destination?: {
    lat: number
    long: number
  }
  setMap: (map: Map) => void
}) {
  return (
    <MapContainer
      ref={(map) => {
        if (map) setMap(map)
      }}
      style={{
        height: "100%",
        width: "100%",
      }}
      center={[lat, long]}
      zoom={LEAFLET_DEFAULT_ZOOM_LEVEL}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={[lat, long]}
        icon={
          new Icon({
            iconUrl: "/assets/img/location-marker/current-location.png",
            iconSize: [50, 50],
          })
        }
      >
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>

      {destination && (
        <Marker
          position={[destination.lat, destination.long]}
          icon={
            new Icon({
              iconUrl:
                "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
              iconSize: [25, 41],
            })
          }
        >
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      )}

      <RecenterAutomatically lat={lat} long={long} destination={destination} />
    </MapContainer>
  )
}
