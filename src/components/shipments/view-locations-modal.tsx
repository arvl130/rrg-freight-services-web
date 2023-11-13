import * as Dialog from "@radix-ui/react-dialog"
import { Shipment } from "@/server/db/entities"
import { api } from "@/utils/api"
import { DateTime } from "luxon"
import { useState } from "react"
import { Map } from "./map/map"
import { X } from "@phosphor-icons/react/X"
import { Map as TMap } from "leaflet"
import { LEAFLET_DEFAULT_ZOOM_LEVEL } from "@/utils/constants"

export function ShipmentsViewLocationsModal({
  shipment,
  isOpen,
  close,
}: {
  shipment: Shipment
  isOpen: boolean
  close: () => void
}) {
  const [map, setMap] = useState<null | TMap>(null)
  const [selectedItemIndex, setSelectedItemIndex] = useState<null | number>(
    null,
  )

  const {
    status,
    data: shipmentLocations,
    error,
  } = api.shipmentLocation.getByShipmentId.useQuery({
    shipmentId: shipment.id,
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
              {shipmentLocations.length === 0 ? (
                <>
                  <div className="border-r border-gray-300 text-center pt-4 text-gray-500 text-sm">
                    No locations recorded.
                  </div>
                  <div className="bg-gray-50"></div>
                </>
              ) : (
                <>
                  <div className="h-full overflow-y-auto border-r border-gray-300">
                    {shipmentLocations.map((shipmentLocation, index) => (
                      <button
                        key={shipmentLocation.id}
                        type="button"
                        className={`
                      border-b border-gray-300 block w-full text-left px-4 py-2 text-sm
                      ${index === selectedItemIndex ? "bg-gray-50" : ""}
                    `}
                        onClick={() => {
                          if (selectedItemIndex === index && map !== null) {
                            map.flyTo(
                              [
                                shipmentLocations[selectedItemIndex].lat,
                                shipmentLocations[selectedItemIndex].long,
                              ],
                              LEAFLET_DEFAULT_ZOOM_LEVEL,
                            )
                          }
                          setSelectedItemIndex(index)
                        }}
                      >
                        <div className="font-medium">
                          {DateTime.fromJSDate(
                            shipmentLocation.createdAt,
                          ).toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}
                        </div>
                        <div className="text-gray-500">
                          {shipmentLocation.lat}&quot;, {shipmentLocation.long}
                          &quot;
                        </div>
                      </button>
                    ))}
                  </div>
                  {selectedItemIndex === null ? (
                    <div className="flex items-center justify-center bg-gray-50">
                      <p className="text-center text-gray-500">
                        Please select a location log.
                      </p>
                    </div>
                  ) : (
                    <div className="h-full w-full bg-gray-50">
                      <Map
                        long={shipmentLocations[selectedItemIndex].long}
                        lat={shipmentLocations[selectedItemIndex].lat}
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
