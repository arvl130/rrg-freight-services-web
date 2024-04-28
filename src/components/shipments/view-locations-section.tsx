import type { ShipmentLocation } from "@/server/db/entities"
import type { Map as TMap } from "leaflet"
import { PathMap } from "./path-map/map"
import { Map } from "./map/map"
import { useState } from "react"
import { DateTime } from "luxon"
import { LEAFLET_DEFAULT_ZOOM_LEVEL } from "@/utils/constants"

export function ViewLocationsSection({
  locations,
}: {
  locations: ShipmentLocation[]
}) {
  const [map, setMap] = useState<null | TMap>(null)
  const [selectedItemIndex, setSelectedItemIndex] = useState<
    "ALL" | "LIVE" | number
  >("ALL")

  return (
    <div className="grid grid-cols-[20rem_1fr] h-full overflow-y-auto">
      {locations.length === 0 ? (
        <>
          <div className="border-r border-gray-300 text-center pt-4 text-gray-500 text-sm">
            No locations recorded.
          </div>
          <div className="bg-gray-50"></div>
        </>
      ) : (
        <>
          <div className="h-full overflow-y-auto border-r border-gray-300">
            <button
              type="button"
              className={`
                border-b border-gray-300 block w-full text-left px-4 py-2 text-sm
                ${selectedItemIndex === "ALL" ? "bg-gray-50" : ""}
              `}
              onClick={() => {
                map?.flyTo(
                  [locations[0].lat, locations[0].long],
                  LEAFLET_DEFAULT_ZOOM_LEVEL,
                )
                setSelectedItemIndex("ALL")
              }}
            >
              <div className="font-medium">Show All</div>
              <div className="text-gray-500">
                Draw arrows connecting recorded locations
              </div>
            </button>
            <button
              type="button"
              className={`
                border-b border-gray-300 block w-full text-left px-4 py-2 text-sm
                ${selectedItemIndex === "LIVE" ? "bg-gray-50" : ""}
              `}
              onClick={() => {
                map?.flyTo(
                  [locations[0].lat, locations[0].long],
                  LEAFLET_DEFAULT_ZOOM_LEVEL,
                )
                setSelectedItemIndex("LIVE")
              }}
            >
              <div className="font-medium">Live View</div>
              <div className="text-gray-500">Show the most recent location</div>
            </button>
            {locations.map((deliveryLocation, index) => (
              <button
                key={deliveryLocation.id}
                type="button"
                className={`
                  border-b border-gray-300 block w-full text-left px-4 py-2 text-sm
                  ${index === selectedItemIndex ? "bg-gray-50" : ""}
                `}
                onClick={() => {
                  if (selectedItemIndex === index && map !== null) {
                    map.flyTo(
                      [
                        locations[selectedItemIndex].lat,
                        locations[selectedItemIndex].long,
                      ],
                      LEAFLET_DEFAULT_ZOOM_LEVEL,
                    )
                  }
                  setSelectedItemIndex(index)
                }}
              >
                <div className="font-medium">
                  {DateTime.fromISO(deliveryLocation.createdAt).toLocaleString(
                    DateTime.DATETIME_FULL_WITH_SECONDS,
                  )}
                </div>
                <div className="text-gray-500">
                  {deliveryLocation.lat}&quot;, {deliveryLocation.long}
                  &quot;
                </div>
              </button>
            ))}
          </div>
          {selectedItemIndex === "ALL" ? (
            <div className="h-full w-full bg-gray-50">
              <PathMap
                locations={locations.toReversed()}
                setMap={(map) => setMap(map)}
              />
            </div>
          ) : (
            <div className="h-full w-full bg-gray-50">
              {selectedItemIndex === "LIVE" ? (
                <Map
                  long={locations[0].long}
                  lat={locations[0].lat}
                  setMap={(map) => setMap(map)}
                />
              ) : (
                <Map
                  long={locations[selectedItemIndex].long}
                  lat={locations[selectedItemIndex].lat}
                  setMap={(map) => setMap(map)}
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
