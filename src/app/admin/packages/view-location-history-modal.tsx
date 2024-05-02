import type {
  NormalizedForwarderTransferShipment,
  ShipmentLocation,
} from "@/server/db/entities"
import type {
  NormalizedDeliveryShipment,
  Package,
  NormalizedWarehouseTransferShipment,
} from "@/server/db/entities"
import { api } from "@/utils/api"
import { X } from "@phosphor-icons/react/dist/ssr/X"
import * as Dialog from "@radix-ui/react-dialog"
import { useState } from "react"
import { LoadingSpinner } from "@/components/spinner"
import { ViewLocationWithHistorySection } from "@/components/packages/view-location-with-history-section"

function removeAfterSettledAt(options: {
  settledAt: null | string
  locations: ShipmentLocation[]
}) {
  if (options.settledAt !== null) {
    return options.locations.filter((l) => {
      const locationRecordedAt = new Date(l.createdAt)
      const settledAt = new Date(options.settledAt!)

      return locationRecordedAt.valueOf() < settledAt.valueOf()
    })
  } else return options.locations
}

function MultipleShipmentsMapView(props: {
  package: Package
  settledAt: null | string
  shipmentIds: number[]
}) {
  const { status, data, error } =
    api.shipment.location.getByShipmentIds.useQuery(
      {
        shipmentIds: props.shipmentIds,
      },
      {
        refetchInterval: 5000,
      },
    )

  if (status === "loading")
    return (
      <div className="flex justify-center items-center">
        <LoadingSpinner />
      </div>
    )
  if (status === "error") return <div>Error occured: {error.message}</div>

  return (
    <ViewLocationWithHistorySection
      package={props.package}
      locations={removeAfterSettledAt({
        settledAt: props.settledAt,
        locations: data,
      })}
    />
  )
}

function ShipmentMapView(props: {
  package: Package
  settledAt: null | string
  shipmentId: number
}) {
  const { status, data, error } =
    api.shipment.location.getByShipmentId.useQuery(
      {
        shipmentId: props.shipmentId,
      },
      {
        refetchInterval: 5000,
      },
    )

  if (status === "loading")
    return (
      <div className="flex justify-center items-center">
        <LoadingSpinner />
      </div>
    )
  if (status === "error") return <div>Error occured: {error.message}</div>

  return (
    <ViewLocationWithHistorySection
      package={props.package}
      locations={removeAfterSettledAt({
        settledAt: props.settledAt,
        locations: data,
      })}
    />
  )
}

function AllTab(props: {
  package: Package
  settledAt: null | string
  deliveryShipments: NormalizedDeliveryShipment[]
  forwarderTransferShipments: NormalizedForwarderTransferShipment[]
  warehouseTransferShipments: NormalizedWarehouseTransferShipment[]
}) {
  const [selectedShipmentId, setSelectedShipmentId] = useState<null | number>(
    null,
  )

  const shipments = [
    ...props.deliveryShipments,
    ...props.forwarderTransferShipments,
    ...props.warehouseTransferShipments,
  ]

  return (
    <div className="grid grid-cols-[16rem_1fr] overflow-auto">
      {shipments.length === 0 ? (
        <>
          <div className="border-r border-gray-300 text-center pt-4 text-gray-500 text-sm">
            No shipments found.
          </div>
          <div className="bg-gray-50"></div>
        </>
      ) : (
        <>
          <div className="border-r border-gray-300">
            <button
              type="button"
              className={`block text-left text-sm px-4 py-2 w-full ${
                selectedShipmentId === null ? "bg-gray-50" : ""
              } hover:bg-gray-100 transition-colors duration-200 border-b border-gray-300`}
              onClick={() => {
                setSelectedShipmentId(null)
              }}
            >
              <p className="font-medium">Show All</p>
              <p className="text-gray-500">All shipments in a single view</p>
            </button>
            {shipments.map((shipment) => (
              <button
                type="button"
                key={shipment.id}
                className={`block text-left text-sm px-4 py-2 w-full ${
                  selectedShipmentId === shipment.id ? "bg-gray-50" : ""
                } hover:bg-gray-100 transition-colors duration-200 border-b border-gray-300`}
                onClick={() => {
                  setSelectedShipmentId(shipment.id)
                }}
              >
                <p className="font-medium">Shipment ID {shipment.id}</p>
              </button>
            ))}
          </div>
          {selectedShipmentId === null ? (
            <MultipleShipmentsMapView
              package={props.package}
              settledAt={props.settledAt}
              shipmentIds={shipments.map((shipment) => shipment.id)}
            />
          ) : (
            <ShipmentMapView
              package={props.package}
              settledAt={props.settledAt}
              shipmentId={selectedShipmentId}
            />
          )}
        </>
      )}
    </div>
  )
}

function DeliveryTab(props: {
  package: Package
  settledAt: null | string
  shipments: NormalizedDeliveryShipment[]
}) {
  const [selectedShipmentId, setSelectedShipmentId] = useState<null | number>(
    null,
  )

  return (
    <div className="grid grid-cols-[16rem_1fr]">
      {props.shipments.length === 0 ? (
        <>
          <div className="border-r border-gray-300 text-center pt-4 text-gray-500 text-sm">
            No shipments found.
          </div>
          <div className="bg-gray-50"></div>
        </>
      ) : (
        <>
          <div className="border-r border-gray-300">
            <button
              type="button"
              className={`block text-left text-sm px-4 py-2 w-full ${
                selectedShipmentId === null ? "bg-gray-50" : ""
              } hover:bg-gray-100 transition-colors duration-200 border-b border-gray-300`}
              onClick={() => {
                setSelectedShipmentId(null)
              }}
            >
              <p className="font-medium">Show All</p>
              <p className="text-gray-500">All shipments in a single view</p>
            </button>
            {props.shipments.map((shipment) => (
              <button
                type="button"
                key={shipment.id}
                className={`block text-left text-sm px-4 py-2 w-full ${
                  selectedShipmentId === shipment.id ? "bg-gray-50" : ""
                } hover:bg-gray-100 transition-colors duration-200 border-b border-gray-300`}
                onClick={() => {
                  setSelectedShipmentId(shipment.id)
                }}
              >
                <p className="font-medium">Shipment ID {shipment.id}</p>
              </button>
            ))}
          </div>
          {selectedShipmentId === null ? (
            <MultipleShipmentsMapView
              package={props.package}
              settledAt={props.settledAt}
              shipmentIds={props.shipments.map((shipment) => shipment.id)}
            />
          ) : (
            <ShipmentMapView
              package={props.package}
              settledAt={props.settledAt}
              shipmentId={selectedShipmentId}
            />
          )}
        </>
      )}
    </div>
  )
}

function ForwarderTransferTab(props: {
  package: Package
  settledAt: null | string
  shipments: NormalizedForwarderTransferShipment[]
}) {
  const [selectedShipmentId, setSelectedShipmentId] = useState<null | number>(
    null,
  )

  return (
    <div className="grid grid-cols-[16rem_1fr]">
      {props.shipments.length === 0 ? (
        <>
          <div className="border-r border-gray-300 text-center pt-4 text-gray-500 text-sm">
            No shipments found.
          </div>
          <div className="bg-gray-50"></div>
        </>
      ) : (
        <>
          <div className="border-r border-gray-300">
            <button
              type="button"
              className={`block text-left text-sm px-4 py-2 w-full ${
                selectedShipmentId === null ? "bg-gray-50" : ""
              } hover:bg-gray-100 transition-colors duration-200 border-b border-gray-300`}
              onClick={() => {
                setSelectedShipmentId(null)
              }}
            >
              <p className="font-medium">Show All</p>
              <p className="text-gray-500">All shipments in a single view</p>
            </button>
            {props.shipments.map((shipment) => (
              <button
                type="button"
                key={shipment.id}
                className={`block text-left text-sm px-4 py-2 w-full ${
                  selectedShipmentId === shipment.id ? "bg-gray-50" : ""
                } hover:bg-gray-100 transition-colors duration-200 border-b border-gray-300`}
                onClick={() => {
                  setSelectedShipmentId(shipment.id)
                }}
              >
                <p className="font-medium">Shipment ID {shipment.id}</p>
              </button>
            ))}
          </div>
          {selectedShipmentId === null ? (
            <MultipleShipmentsMapView
              package={props.package}
              settledAt={props.settledAt}
              shipmentIds={props.shipments.map((shipment) => shipment.id)}
            />
          ) : (
            <ShipmentMapView
              package={props.package}
              settledAt={props.settledAt}
              shipmentId={selectedShipmentId}
            />
          )}
        </>
      )}
    </div>
  )
}

function WarehouseTransferTab(props: {
  package: Package
  settledAt: null | string
  shipments: NormalizedWarehouseTransferShipment[]
}) {
  const [selectedShipmentId, setSelectedShipmentId] = useState<null | number>(
    null,
  )

  return (
    <div className="grid grid-cols-[16rem_1fr]">
      {props.shipments.length === 0 ? (
        <>
          <div className="border-r border-gray-300 text-center pt-4 text-gray-500 text-sm">
            No shipments found.
          </div>
          <div className="bg-gray-50"></div>
        </>
      ) : (
        <>
          <div className="border-r border-gray-300">
            <button
              type="button"
              className={`block text-left text-sm px-4 py-2 w-full ${
                selectedShipmentId === null ? "bg-gray-50" : ""
              } hover:bg-gray-100 transition-colors duration-200 border-b border-gray-300`}
              onClick={() => {
                setSelectedShipmentId(null)
              }}
            >
              <p className="font-medium">Show All</p>
              <p className="text-gray-500">All shipments in a single view</p>
            </button>
            {props.shipments.map((shipment) => (
              <button
                type="button"
                key={shipment.id}
                className={`block text-left text-sm px-4 py-2 w-full ${
                  selectedShipmentId === shipment.id ? "bg-gray-50" : ""
                } hover:bg-gray-100 transition-colors duration-200 border-b border-gray-300`}
                onClick={() => {
                  setSelectedShipmentId(shipment.id)
                }}
              >
                <p className="font-medium">Shipment ID {shipment.id}</p>
              </button>
            ))}
          </div>
          {selectedShipmentId === null ? (
            <MultipleShipmentsMapView
              package={props.package}
              settledAt={props.settledAt}
              shipmentIds={props.shipments.map((shipment) => shipment.id)}
            />
          ) : (
            <ShipmentMapView
              package={props.package}
              settledAt={props.settledAt}
              shipmentId={selectedShipmentId}
            />
          )}
        </>
      )}
    </div>
  )
}

type Tab = "" | "DELIVERY" | "WAREHOUSE" | "FORWARDER"

function MainSection(props: {
  package: Package
  settledAt: null | string
  deliveryShipments: NormalizedDeliveryShipment[]
  forwarderTransferShipments: NormalizedForwarderTransferShipment[]
  warehouseTransferShipments: NormalizedWarehouseTransferShipment[]
}) {
  const [selectedTab, setSelectedTab] = useState<Tab>("")

  return (
    <div className="grid grid-rows-[auto_1fr_auto] overflow-auto">
      <div className="px-4 py-2">
        <p>
          Showing History for:{" "}
          <select
            className="px-3 py-1 bg-white border border-gray-300 rounded-md w-56"
            value={selectedTab}
            onChange={(e) => {
              setSelectedTab(e.currentTarget.value as Tab)
            }}
          >
            <option value="">All Shipments</option>
            <option value="DELIVERY">Delivery Shipments</option>
            <option value="WAREHOUSE">Forwarder Transfer Shipments</option>
            <option value="FORWARDER">Warehouse Transfer Shipments</option>
          </select>
        </p>
      </div>
      {selectedTab === "" && (
        <AllTab
          package={props.package}
          settledAt={props.settledAt}
          deliveryShipments={props.deliveryShipments}
          forwarderTransferShipments={props.forwarderTransferShipments}
          warehouseTransferShipments={props.warehouseTransferShipments}
        />
      )}
      {selectedTab === "DELIVERY" && (
        <DeliveryTab
          package={props.package}
          settledAt={props.settledAt}
          shipments={props.deliveryShipments}
        />
      )}
      {selectedTab === "FORWARDER" && (
        <ForwarderTransferTab
          package={props.package}
          settledAt={props.settledAt}
          shipments={props.forwarderTransferShipments}
        />
      )}
      {selectedTab === "WAREHOUSE" && (
        <WarehouseTransferTab
          package={props.package}
          settledAt={props.settledAt}
          shipments={props.warehouseTransferShipments}
        />
      )}
      <div></div>
    </div>
  )
}

export function ViewLocationHistoryModal({
  item,
  isOpen,
  onClose,
}: {
  item: Package
  isOpen: boolean
  onClose: () => void
}) {
  const { status, data, error } = api.shipment.getAllTypesByPackageId.useQuery({
    packageId: item.id,
  })

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="bg-black/40 fixed inset-0"
          onClick={onClose}
        />
        <Dialog.Content
          onEscapeKeyDown={onClose}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_3rem),_72rem)] h-[calc(100svh_-_3rem)] grid grid-rows-[auto_1fr] rounded-2xl bg-white"
        >
          <Dialog.Title className="text-white font-bold text-center items-center py-2 [background-color:_#78CFDC] h-full rounded-t-2xl">
            View Location History
          </Dialog.Title>
          {status === "loading" && (
            <div className="flex justify-center items-center">
              <LoadingSpinner />
            </div>
          )}
          {status === "error" && <div>Error occured: {error.message}</div>}
          {status === "success" && (
            <MainSection
              package={item}
              settledAt={item.settledAt}
              deliveryShipments={data.deliveryShipments}
              forwarderTransferShipments={data.forwarderTransferShipments}
              warehouseTransferShipments={data.warehouseTransferShipments}
            />
          )}
          <Dialog.Close asChild>
            <button
              type="button"
              className="text-white absolute top-3 right-3"
              onClick={onClose}
            >
              <X size={20} />
              <span className="sr-only">Close</span>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
