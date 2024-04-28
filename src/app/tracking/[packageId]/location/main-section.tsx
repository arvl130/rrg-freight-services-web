"use client"

import type { NormalizedForwarderTransferShipment } from "@/server/db/entities"
import type {
  NormalizedDeliveryShipment,
  NormalizedWarehouseTransferShipment,
} from "@/server/db/entities"
import { api } from "@/utils/api"
import { useState } from "react"
import { ViewLocationsSection } from "@/components/shipments/view-locations-section"
import { LoadingSpinner } from "@/components/spinner"
import Image from "next/image"
import Link from "next/link"

function MultipleShipmentsMapView(props: { shipmentIds: number[] }) {
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

  return <ViewLocationsSection locations={data} />
}

function ShipmentMapView(props: { shipmentId: number }) {
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

  return <ViewLocationsSection locations={data} />
}

function AllTab(props: {
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
  ].toSorted((a, b) => {
    const date1 = new Date(a.createdAt)
    const date2 = new Date(b.createdAt)

    return date2.valueOf() - date1.valueOf()
  })

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
          <div className="border-r border-gray-300 overflow-auto">
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
              shipmentIds={shipments.map((shipment) => shipment.id)}
            />
          ) : (
            <ShipmentMapView shipmentId={selectedShipmentId} />
          )}
        </>
      )}
    </div>
  )
}

function DeliveryTab(props: { shipments: NormalizedDeliveryShipment[] }) {
  const [selectedShipmentId, setSelectedShipmentId] = useState<null | number>(
    null,
  )

  return (
    <div className="grid grid-cols-[16rem_1fr] overflow-auto">
      {props.shipments.length === 0 ? (
        <>
          <div className="border-r border-gray-300 text-center pt-4 text-gray-500 text-sm">
            No shipments found.
          </div>
          <div className="bg-gray-50"></div>
        </>
      ) : (
        <>
          <div className="border-r border-gray-300 overflow-auto">
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
              shipmentIds={props.shipments.map((shipment) => shipment.id)}
            />
          ) : (
            <ShipmentMapView shipmentId={selectedShipmentId} />
          )}
        </>
      )}
    </div>
  )
}

function ForwarderTransferTab(props: {
  shipments: NormalizedForwarderTransferShipment[]
}) {
  const [selectedShipmentId, setSelectedShipmentId] = useState<null | number>(
    null,
  )

  return (
    <div className="grid grid-cols-[16rem_1fr] overflow-auto">
      {props.shipments.length === 0 ? (
        <>
          <div className="border-r border-gray-300 text-center pt-4 text-gray-500 text-sm">
            No shipments found.
          </div>
          <div className="bg-gray-50"></div>
        </>
      ) : (
        <>
          <div className="border-r border-gray-300 overflow-auto">
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
              shipmentIds={props.shipments.map((shipment) => shipment.id)}
            />
          ) : (
            <ShipmentMapView shipmentId={selectedShipmentId} />
          )}
        </>
      )}
    </div>
  )
}

function WarehouseTransferTab(props: {
  shipments: NormalizedWarehouseTransferShipment[]
}) {
  const [selectedShipmentId, setSelectedShipmentId] = useState<null | number>(
    null,
  )

  return (
    <div className="grid grid-cols-[16rem_1fr] overflow-auto">
      {props.shipments.length === 0 ? (
        <>
          <div className="border-r border-gray-300 text-center pt-4 text-gray-500 text-sm">
            No shipments found.
          </div>
          <div className="bg-gray-50"></div>
        </>
      ) : (
        <>
          <div className="border-r border-gray-300 overflow-auto">
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
              shipmentIds={props.shipments.map((shipment) => shipment.id)}
            />
          ) : (
            <ShipmentMapView shipmentId={selectedShipmentId} />
          )}
        </>
      )}
    </div>
  )
}

type Tab = "" | "DELIVERY" | "WAREHOUSE" | "FORWARDER"

export function MainSection(props: {
  packageId: string
  deliveryShipments: NormalizedDeliveryShipment[]
  forwarderTransferShipments: NormalizedForwarderTransferShipment[]
  warehouseTransferShipments: NormalizedWarehouseTransferShipment[]
}) {
  const [selectedTab, setSelectedTab] = useState<Tab>("")

  return (
    <div className="grid grid-rows-[auto_1fr_auto] h-dvh">
      <div className="px-6 py-4 grid grid-cols-[1fr_auto] bg-brand-cyan-500">
        <div>
          <Image
            src="/assets/img/logos/new-logo-nav-bar.png"
            alt="Logo of RRG Freight Services"
            width={300}
            height={90}
          />
        </div>
        <div className="flex items-end justify-center flex-col gap-y-1">
          <p className="font-semibold text-lg text-white">
            Tracking Number: {props.packageId}
          </p>
          <p>
            <span className="text-white font-semibold text-lg">
              Showing History for:{" "}
            </span>
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
          <Link
            href={`/tracking?id=${props.packageId}`}
            className="text-white hover:underline"
          >
            « Back to Tracking page
          </Link>
        </div>
      </div>
      {selectedTab === "" && (
        <AllTab
          deliveryShipments={props.deliveryShipments}
          forwarderTransferShipments={props.forwarderTransferShipments}
          warehouseTransferShipments={props.warehouseTransferShipments}
        />
      )}
      {selectedTab === "DELIVERY" && (
        <DeliveryTab
          shipments={props.deliveryShipments.toSorted((a, b) => {
            const date1 = new Date(a.createdAt)
            const date2 = new Date(b.createdAt)

            return date2.valueOf() - date1.valueOf()
          })}
        />
      )}
      {selectedTab === "FORWARDER" && (
        <ForwarderTransferTab
          shipments={props.forwarderTransferShipments.toSorted((a, b) => {
            const date1 = new Date(a.createdAt)
            const date2 = new Date(b.createdAt)

            return date2.valueOf() - date1.valueOf()
          })}
        />
      )}
      {selectedTab === "WAREHOUSE" && (
        <WarehouseTransferTab
          shipments={props.warehouseTransferShipments.toSorted((a, b) => {
            const date1 = new Date(a.createdAt)
            const date2 = new Date(b.createdAt)

            return date2.valueOf() - date1.valueOf()
          })}
        />
      )}
      <div></div>
    </div>
  )
}
