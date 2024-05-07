"use client"

import type { Package, ShipmentLocation } from "@/server/db/entities"
import { api } from "@/utils/api"
import { ViewLastLocationSection } from "@/components/packages/view-last-location-section"
import { List } from "@phosphor-icons/react/dist/ssr/List"
import { CheckFat } from "@phosphor-icons/react/dist/ssr/CheckFat"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { LoadingSpinner } from "@/components/spinner"

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

function HasShipmentLocations(props: {
  settledAt: string | null
  locations: ShipmentLocation[]
  package: Package
  hasTakenSurvey: boolean
  accessKey: string
}) {
  const locations = removeAfterSettledAt({
    settledAt: props.settledAt,
    locations: props.locations,
  })

  if (locations.length === 0)
    return (
      <div className="flex justify-center items-center text-gray-500 text-sm">
        <p>Location has not yet been recorded.</p>
      </div>
    )

  return (
    <div className="grid grid-rows-[auto_1fr]">
      {props.package.status === "DELIVERED" ? (
        <div className="flex justify-between bg-green-500 px-4 py-2">
          <div className=" text-white inline-flex gap-2 font-medium items-center">
            <CheckFat size={24} />
            This package has been delivered.
          </div>
          {!props.hasTakenSurvey ? (
            <div className="flex">
              <Link
                className="px-4 py-2 bg-blue-500 hover:bg-blue-400 transition-colors duration-200 disabled:bg-blue-300 rounded-md text-white font-medium"
                href={`/tracking/${props.package.id}/survey?accessKey=${props.accessKey}`}
              >
                Fill up our Survey
              </Link>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      ) : (
        <div></div>
      )}

      <ViewLastLocationSection
        hasEta={props.package.status === "OUT_FOR_DELIVERY"}
        package={props.package}
        location={locations[0]}
      />
    </div>
  )
}

function MobileNav(props: { packageId: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="md:hidden relative h-full text-white">
      <div className="px-3 h-full flex justify-between items-center py-3">
        <Link href="/">
          <Image
            src="/assets/img/logos/logo-header-enhanced.png"
            alt="Logo of RRG Freight Services"
            width={210}
            height={70}
          />
        </Link>

        <button
          type="button"
          onClick={() => {
            setIsMobileMenuOpen((currIsMobileMenuOpen) => !currIsMobileMenuOpen)
          }}
          className="text-3xl block font-bold focus:outline-none "
        >
          <List />
        </button>
      </div>
      {isMobileMenuOpen && (
        <ul
          className={`absolute top-20 [background-color:_#79CFDC] px-3 w-full space-y-1 pb-3`}
        >
          <div className="bg-white text-brand-cyan-500 rounded-lg px-4 py-2">
            <div className=" grid grid-cols-[auto_1fr] gap-x-3">
              <div className="font-medium">Tracking number:</div>
              <div>{props.packageId}</div>
              <div className="col-span-2 mt-1 inline-flex flex-wrap gap-x-3 gap-y-2 text-sm">
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
                  <p>Your current location</p>
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
          </div>

          <li className="font-medium">
            <Link
              className="underline"
              href={`/tracking?id=${props.packageId}`}
            >
              « Back to Tracking
            </Link>
          </li>
        </ul>
      )}
    </div>
  )
}

function DesktopNav(props: { packageId: string }) {
  return (
    <div className="hidden px-6 py-2 md:grid md:grid-cols-[1fr_auto] bg-brand-cyan-500">
      <div>
        <Image
          src="/assets/img/logos/new-logo-nav-bar.png"
          alt="Logo of RRG Freight Services"
          width={150}
          height={30}
        />
      </div>
      <div className="flex items-end justify-center flex-col gap-y-1">
        <p className="font-semibold text-lg text-white">
          Tracking Number: {props.packageId}
        </p>
        <Link
          href={`/tracking?id=${props.packageId}`}
          className="text-white hover:underline"
        >
          « Back to Tracking page
        </Link>
      </div>
    </div>
  )
}

function Navbar(props: { packageId: string }) {
  return (
    <>
      <div className="h-20 bg-[#79CFDC]"></div>
      <div
        className={`h-20 bg-[#79CFDC] w-full top-0 fixed z-[1001] transition-all duration-300`}
      >
        <MobileNav packageId={props.packageId} />
        <DesktopNav packageId={props.packageId} />
      </div>
    </>
  )
}

export function MainSection(props: {
  settledAt: string | null
  package: Package
  hasTakenSurvey: boolean
  accessKey: string
}) {
  const { status, data, error } = api.shipment.location.getByPackageId.useQuery(
    {
      packageId: props.package.id,
    },
    {
      refetchInterval: 5000,
    },
  )

  return (
    <div className="grid grid-rows-[auto_1fr] h-dvh">
      <div>
        <Navbar packageId={props.package.id} />
      </div>
      {status === "loading" && (
        <>
          <div></div>
          <div className="flex justify-center items-center">
            <LoadingSpinner />
          </div>
        </>
      )}
      {status === "error" && <div>Error occured: {error.message}</div>}
      {status === "success" && (
        <HasShipmentLocations
          settledAt={props.settledAt}
          locations={data}
          package={props.package}
          hasTakenSurvey={props.hasTakenSurvey}
          accessKey={props.accessKey}
        />
      )}
    </div>
  )
}
