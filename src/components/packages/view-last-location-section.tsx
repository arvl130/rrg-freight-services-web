import type { Package, ShipmentLocation } from "@/server/db/entities"
import { Map } from "@/components/shipments/map/map"
import { useState } from "react"
import { api } from "@/utils/api"
import Image from "next/image"
import { LoadingSpinner } from "../spinner"

function EstimatedTimeOfArrivalWithCoordinates(props: {
  source: { lat: number; long: number }
  destination: { lat: number; long: number }
}) {
  const { status, data, error } =
    api.shipment.location.getEstimatedTimeOfArrival.useQuery(props)

  if (status === "pending") return <>...</>
  if (status === "error") return <>Error occured: {error.message}</>

  return <>{data}</>
}

function EstimatedTimeOfArrivalWithAddress(props: {
  source: { lat: number; long: number }
  destinationAddress: string
}) {
  const { status, data, error } =
    api.shipment.location.getEstimatedTimeOfArrivalWithDestinationAddress.useQuery(
      props,
    )

  if (status === "pending") return <>...</>
  if (status === "error") return <>Error occured: {error.message}</>

  return <>{data}</>
}

function strToLatLng(str: string) {
  const [lat, long] = str.split(":")

  return {
    lat: Number(lat),
    long: Number(long),
  }
}

function HasNoDestinationCoordinates(props: {
  hasEta?: boolean
  package: Package
  source: {
    lat: number
    long: number
  }
  destinationAddress: string
}) {
  const { status, data, error } =
    api.shipment.location.getLatLongFromAddress.useQuery({
      address: props.destinationAddress,
    })

  return (
    <>
      {props.hasEta ? (
        <div className="px-4 py-2">
          <div>
            The package will arrive at the consignee address in about{" "}
            <span className="font-semibold">
              <EstimatedTimeOfArrivalWithAddress
                source={props.source}
                destinationAddress={props.destinationAddress}
              />
            </span>
            .
          </div>
          <div className="mt-3 inline-flex flex-wrap gap-x-3 gap-y-2 text-sm">
            <div className="grid grid-cols-[1.75rem_1fr] gap-x-1 items-center">
              <div className="flex justify-center">
                <Image
                  height={41}
                  width={25}
                  src="/assets/img/location-marker/marker.png"
                  alt="Your current location"
                  className="h-6 w-4"
                />
              </div>
              <p>Consignee address</p>
            </div>
            <div className="grid grid-cols-[1.75rem_1fr] gap-x-1 items-center">
              <div className="flex justify-center">
                <Image
                  height={50}
                  width={50}
                  src="/assets/img/location-marker/current-location.png"
                  alt="Your current location"
                  className="h-6 w-6"
                />
              </div>

              <p>Package location</p>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}

      {status === "pending" && (
        <div className="flex justify-center items-center">
          <LoadingSpinner />
        </div>
      )}
      {status === "error" && <div>Error occured: {error.message}</div>}
      {status === "success" && (
        <div className="h-full w-full overflow-y-auto">
          <Map
            long={props.source.long}
            lat={props.source.lat}
            destination={data}
            setMap={() => {}}
          />
        </div>
      )}
    </>
  )
}

export function ViewLastLocationSection({
  package: _package,
  location,
  hasEta,
}: {
  package: Package
  location: ShipmentLocation
  hasEta?: boolean
}) {
  const [currentCoordinates, setCurrentCoordinates] = useState<null | {
    lat: number
    long: number
  }>(null)

  return (
    <div className="grid grid-rows-[auto_1fr]">
      {_package.lastCoordinates === null ? (
        <HasNoDestinationCoordinates
          hasEta={hasEta}
          package={_package}
          source={{
            long: location.long,
            lat: location.lat,
          }}
          destinationAddress={`${_package.receiverStreetAddress}, ${_package.receiverBarangay}, ${_package.receiverCity}, ${_package.receiverStateOrProvince}, Philippines ${_package.receiverPostalCode}`}
        />
      ) : (
        <>
          {hasEta ? (
            <div className="md:grid grid-cols-[1fr_auto]">
              <div className="inline-flex flex-wrap gap-x-3 gap-y-2 text-sm">
                <div className="grid grid-cols-[1.75rem_1fr] gap-x-1 items-center">
                  <div className="flex justify-center">
                    <Image
                      height={41}
                      width={25}
                      src="/assets/img/location-marker/marker.png"
                      alt="Your current location"
                      className="h-6 w-4"
                    />
                  </div>
                  <p>Consignee address</p>
                </div>
                <div className="grid grid-cols-[1.75rem_1fr] gap-x-1 items-center">
                  <div className="flex justify-center">
                    <Image
                      height={50}
                      width={50}
                      src="/assets/img/location-marker/current-location.png"
                      alt="Your current location"
                      className="h-6 w-6"
                    />
                  </div>

                  <p>Package location</p>
                </div>
              </div>
              <div>
                The package will arrive at the consignee address in about{" "}
                <span className="font-semibold">
                  <EstimatedTimeOfArrivalWithAddress
                    source={{
                      long: location.long,
                      lat: location.lat,
                    }}
                    destinationAddress={`${_package.receiverStreetAddress}, ${_package.receiverBarangay}, ${_package.receiverCity}, ${_package.receiverStateOrProvince}, Philippines ${_package.receiverPostalCode}`}
                  />
                </span>
                .
              </div>
            </div>
          ) : (
            <div></div>
          )}

          <div className="h-full w-full overflow-y-auto">
            <Map
              long={location.long}
              lat={location.lat}
              destination={strToLatLng(_package.lastCoordinates)}
              setMap={() => {}}
            />
          </div>
        </>
      )}
    </div>
  )
}
