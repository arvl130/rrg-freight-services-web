import { MapContainer } from "react-leaflet/MapContainer"
import { TileLayer } from "react-leaflet/TileLayer"
import { Polyline } from "react-leaflet/Polyline"
import "@/styles/leaflet/leaflet.css"
import type { Map, Polyline as TPolyline } from "leaflet"
import { LEAFLET_DEFAULT_ZOOM_LEVEL } from "@/utils/constants"
import type { ShipmentLocation } from "@/server/db/entities"
import { useEffect, useRef } from "react"
import "leaflet-arrowheads"

function ArrowHeadPolylines({ locations }: { locations: ShipmentLocation[] }) {
  const ref = useRef<null | TPolyline>(null)

  useEffect(() => {
    ref.current?.arrowheads({
      yawn: 40,
      fill: true,
      size: "15px",
    })
  }, [])

  return (
    <Polyline
      ref={ref}
      positions={locations.map((location) => [location.lat, location.long])}
    />
  )
}

export default function PathBareMap({
  locations,
  setMap,
}: {
  locations: ShipmentLocation[]
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
      center={[locations[0].lat, locations[0].long]}
      zoom={LEAFLET_DEFAULT_ZOOM_LEVEL}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ArrowHeadPolylines locations={locations} />

      {/* <RecenterAutomatically lat={lat} long={long} /> */}
    </MapContainer>
  )
}
