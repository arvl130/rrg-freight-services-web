import * as Dialog from "@radix-ui/react-dialog"
import { NormalizedDeliveryShipment } from "@/server/db/entities"
import { api } from "@/utils/api"
import { DateTime } from "luxon"
import { useState } from "react"
import { Map } from "./map/map"
import { X } from "@phosphor-icons/react/X"
import { Map as TMap } from "leaflet"
import { LEAFLET_DEFAULT_ZOOM_LEVEL } from "@/utils/constants"
import { PathMap } from "./path-map/map"

export function ViewLocationsModal({
  delivery,
  isOpen,
  close,
}: {
  delivery: NormalizedDeliveryShipment
  isOpen: boolean
  close: () => void
}) {
  const [map, setMap] = useState<null | TMap>(null)
  const [selectedItemIndex, setSelectedItemIndex] = useState<null | number>(
    null,
  )

  const {
    status,
    data: deliveryLocations,
    error,
  } = api.shipment.location.getByDeliveryId.useQuery({
    deliveryId: delivery.id,
  })

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0" />
        <Dialog.Content
          onEscapeKeyDown={() => {
            setSelectedItemIndex(null)
            close()
          }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_2rem),_56rem)] h-[38.5rem] grid grid-rows-[auto_1fr] rounded-lg bg-white"
        >
          <Dialog.Title className="[background-color:_#78CFDC] px-4 py-2 rounded-t-lg text-white font-semibold text-center grid grid-cols-[1.5rem_1fr_1.5rem]">
            <div></div>
            <div>Locations</div>
            <button
              type="button"
              className="flex items-center justify-center"
              onClick={() => {
                setSelectedItemIndex(null)
                close()
              }}
            >
              <X size={20} />
            </button>
          </Dialog.Title>
          {status === "loading" && (
            <div className="text-center">Loading ...</div>
          )}
          {status === "error" && (
            <div className="text-center">
              An error occured while retrieving locations: {error.message}
            </div>
          )}
          {status === "success" && (
            <div className="grid grid-cols-[20rem_1fr] h-full overflow-y-auto">
              {deliveryLocations.length === 0 ? (
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
                        ${selectedItemIndex === null ? "bg-gray-50" : ""}
                      `}
                      onClick={() => {
                        map?.flyTo(
                          [deliveryLocations[0].lat, deliveryLocations[0].long],
                          LEAFLET_DEFAULT_ZOOM_LEVEL,
                        )
                        setSelectedItemIndex(null)
                      }}
                    >
                      <div className="font-medium">Show All</div>
                      <div className="text-gray-500">
                        Draw arrows connecting recorded locations
                      </div>
                    </button>
                    {deliveryLocations.map((deliveryLocation, index) => (
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
                                deliveryLocations[selectedItemIndex].lat,
                                deliveryLocations[selectedItemIndex].long,
                              ],
                              LEAFLET_DEFAULT_ZOOM_LEVEL,
                            )
                          }
                          setSelectedItemIndex(index)
                        }}
                      >
                        <div className="font-medium">
                          {DateTime.fromJSDate(
                            deliveryLocation.createdAt,
                          ).toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}
                        </div>
                        <div className="text-gray-500">
                          {deliveryLocation.lat}&quot;, {deliveryLocation.long}
                          &quot;
                        </div>
                      </button>
                    ))}
                  </div>
                  {selectedItemIndex === null ? (
                    <div className="h-full w-full bg-gray-50">
                      <PathMap
                        locations={deliveryLocations}
                        setMap={(map) => setMap(map)}
                      />
                    </div>
                  ) : (
                    <div className="h-full w-full bg-gray-50">
                      <Map
                        long={deliveryLocations[selectedItemIndex].long}
                        lat={deliveryLocations[selectedItemIndex].lat}
                        setMap={(map) => setMap(map)}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
