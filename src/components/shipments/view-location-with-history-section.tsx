import type { ShipmentLocation } from "@/server/db/entities"
import type { Map as TMap } from "leaflet"
import { PathMap } from "./path-map/map"
import { Map } from "./map/map"
import { useEffect, useState } from "react"
import { DateTime } from "luxon"
import { LEAFLET_DEFAULT_ZOOM_LEVEL } from "@/utils/constants"
import { api } from "@/utils/api"
import usePermission from "@custom-react-hooks/use-permission"

function SmallLoadingSpinner() {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  )
}

function EstimatedTimeOfArrival(props: {
  source: { lat: number; long: number }
  destination: { lat: number; long: number }
}) {
  const { status, data, error } =
    api.shipment.location.getEstimatedTimeOfArrival.useQuery(props)

  if (status === "pending") return <>...</>
  if (status === "error") return <>Error occured: {error.message}</>

  return <>{data}</>
}

function LocationAccessPrompt(props: { lat: number; long: number }) {
  const [isLocating, setIsLocating] = useState(false)
  const [coordinates, setCoordinates] = useState<null | {
    lat: number
    long: number
  }>(null)
  const { isLoading, state, error } = usePermission("geolocation")

  useEffect(() => {
    if (!isLoading && state !== "denied" && coordinates === null) {
      setIsLocating(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            long: position.coords.longitude,
            lat: position.coords.latitude,
          })
          setIsLocating(false)
        },
        (error) => {
          setIsLocating(false)
        },
      )
    }
  }, [isLoading, state, coordinates])

  if (isLoading) return <SmallLoadingSpinner />
  if (error) return <>{error}</>

  return (
    <div className="px-4 py-2">
      {state === "denied" && (
        <p>
          Location access is required to get an estimate on the time of arrival.
        </p>
      )}

      {isLocating ? (
        <div className="inline-flex gap-2">
          <SmallLoadingSpinner />
          Estimating time of arrival ...
        </div>
      ) : (
        <div className="flex justify-between gap-1 items-center">
          <div>
            The package should arrive at your location in about{" "}
            <span className="font-semibold">
              {coordinates !== null && (
                <EstimatedTimeOfArrival
                  source={{
                    lat: props.lat,
                    long: props.long,
                  }}
                  destination={{
                    lat: coordinates.lat,
                    long: coordinates.long,
                  }}
                />
              )}
            </span>
            .
          </div>
          <button
            type="button"
            className="ml-2 font-medium bg-green-500 hover:bg-green-400 transition-colors duration-200 text-white px-4 py-2 rounded-md"
            onClick={() => {
              setIsLocating(true)
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  setCoordinates({
                    long: position.coords.longitude,
                    lat: position.coords.latitude,
                  })
                  setIsLocating(false)
                },
                (error) => {
                  setIsLocating(false)
                },
              )
            }}
          >
            Re-run Estimation
          </button>
        </div>
      )}
    </div>
  )
}

export function ViewLocationWithHistorySection({
  locations,
  hasEta,
}: {
  locations: ShipmentLocation[]
  hasEta?: true
}) {
  const [map, setMap] = useState<null | TMap>(null)
  const [selectedItemIndex, setSelectedItemIndex] = useState<
    "ALL" | "LIVE" | number
  >("LIVE")

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
            <>
              {selectedItemIndex === "LIVE" ? (
                <div className="grid grid-rows-[auto_1fr]">
                  {hasEta ? (
                    <LocationAccessPrompt
                      long={locations[0].long}
                      lat={locations[0].lat}
                    />
                  ) : (
                    <div></div>
                  )}
                  <div className="h-full w-full bg-gray-50">
                    <Map
                      long={locations[0].long}
                      lat={locations[0].lat}
                      setMap={(map) => setMap(map)}
                    />
                  </div>
                </div>
              ) : (
                <div className="h-full w-full bg-gray-50">
                  <Map
                    long={locations[selectedItemIndex].long}
                    lat={locations[selectedItemIndex].lat}
                    setMap={(map) => setMap(map)}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
