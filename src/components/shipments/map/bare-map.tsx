import { MapContainer } from "react-leaflet/MapContainer"
import { TileLayer } from "react-leaflet/TileLayer"
import { Marker } from "react-leaflet/Marker"
import { Popup } from "react-leaflet/Popup"
import "@/styles/leaflet/leaflet.css"
import type { Map } from "leaflet"
import { Icon } from "leaflet"
import MarkerIcon from "leaflet/dist/images/marker-icon.png"
import { useMap } from "react-leaflet/hooks"
import { useEffect } from "react"
import { LEAFLET_DEFAULT_ZOOM_LEVEL } from "@/utils/constants"

function RecenterAutomatically({ lat, long }: { lat: number; long: number }) {
  const map = useMap()

  useEffect(() => {
    map.flyTo([lat, long], LEAFLET_DEFAULT_ZOOM_LEVEL)
  }, [lat, long, map])

  return <></>
}

export default function BareMap({
  lat,
  long,
  setMap,
}: {
  lat: number
  long: number
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
            iconUrl: MarkerIcon.src,
            iconSize: [MarkerIcon.width, MarkerIcon.height],
          })
        }
      >
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>

      <RecenterAutomatically lat={lat} long={long} />
    </MapContainer>
  )
}
