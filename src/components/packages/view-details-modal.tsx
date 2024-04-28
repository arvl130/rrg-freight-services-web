import * as Dialog from "@radix-ui/react-dialog"
import type { Package } from "@/server/db/entities"
import { X } from "@phosphor-icons/react/dist/ssr/X"
import { api } from "@/utils/api"
import { Package as PhosphorIconPackage } from "@phosphor-icons/react/dist/ssr/Package"
import { MapPinLine } from "@phosphor-icons/react/dist/ssr/MapPinLine"
import { Truck } from "@phosphor-icons/react/dist/ssr/Truck"
import { Path } from "@phosphor-icons/react/dist/ssr/Path"
import { CaretDown } from "@phosphor-icons/react/dist/ssr/CaretDown"
import { CaretUp } from "@phosphor-icons/react/dist/ssr/CaretUp"
import { Check } from "@phosphor-icons/react/dist/ssr/Check"
import { useState } from "react"
import { DateTime } from "luxon"
import { getEstimatedDeliveryOfPackage } from "@/utils/estimated-delivery"
import { getHumanizedOfPackageStatus } from "@/utils/humanize"

function TopLayer({ package: _package }: { package: Package }) {
  return (
    <div className="grid grid-cols-3 px-16 py-3 [background-color:_#54BCCC] text-white">
      <div>
        <p className="font-medium">Shipped via</p>
        <p>
          {_package.shippingMode === "SEA" ? <>Sea Cargo</> : <>Air Cargo</>}
        </p>
      </div>
      <div>
        <p className="font-medium">Status</p>
        <p className="capitalize">
          {getHumanizedOfPackageStatus(_package.status)}
        </p>
      </div>
      <div>
        <p className="font-medium">Estimated Delivery</p>
        <p>{getEstimatedDeliveryOfPackage(_package)}</p>
      </div>
    </div>
  )
}

function LogEntries({ packageId }: { packageId: string }) {
  const {
    status,
    data: packageStatusLogs,
    error,
  } = api.packageStatusLog.getByPackageId.useQuery({
    packageId,
  })

  if (status === "loading")
    return <div className="max-w-sm mx-auto text-center">Loading ...</div>

  if (status === "error")
    return (
      <div className="max-w-sm mx-auto text-center">
        An error occured while retrieving entries: {error.message}
      </div>
    )

  if (packageStatusLogs.length === 0)
    return (
      <div className="max-w-sm mx-auto text-center">No entries recorded.</div>
    )

  return (
    <div className="max-w-md mx-auto">
      {packageStatusLogs.map((statusLog, index) => (
        <div
          key={statusLog.id}
          className="grid grid-cols-[4rem_4rem_1fr] gap-3"
        >
          <div>
            <p className="text-right">
              {DateTime.fromISO(statusLog.createdAt).toFormat("LLL d")}
            </p>
            <p className="text-gray-500 text-sm text-right">
              {DateTime.fromISO(statusLog.createdAt).toLocaleString(
                DateTime.TIME_SIMPLE,
              )}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-green-500 rounded-full w-full aspect-square text-white flex justify-center items-center">
              <Check size={32} />
            </div>
            {packageStatusLogs.length > 1 &&
              index !== packageStatusLogs.length - 1 && (
                <div className="w-1 min-h-[4rem] bg-green-500"></div>
              )}
          </div>
          <div>
            <p>{statusLog.status.replaceAll("_", " ")}</p>
            <p className="text-gray-500 text-sm">{statusLog.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ViewDetailsModal({
  package: _package,
  isOpen,
  close,
}: {
  package: Package
  isOpen: boolean
  close: () => void
}) {
  const [isVisibleStatusLogs, setIsVisibleStatusLogs] = useState(false)

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0" />
        <Dialog.Content
          onEscapeKeyDown={() => {
            setIsVisibleStatusLogs(false)
            close()
          }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_2rem),_56rem)] h-[34.5rem] grid grid-rows-[2.5rem_1fr] rounded-t-lg bg-white"
        >
          <Dialog.Title className="[background-color:_#78CFDC] px-4 py-2 rounded-t-lg text-white font-semibold text-center grid grid-cols-[1.5rem_1fr_1.5rem]">
            <div></div>
            <div>Details</div>
            <button
              type="button"
              className="flex items-center justify-center"
              onClick={() => {
                setIsVisibleStatusLogs(false)
                close()
              }}
            >
              <X size={20} />
            </button>
          </Dialog.Title>
          <div className="grid grid-rows-[4.5rem_1fr] overflow-y-auto">
            <TopLayer package={_package} />
            <div className="px-16 py-6 overflow-y-auto">
              <div className="mb-6">
                <div className="grid grid-cols-[auto_1fr_auto_1fr_auto_1fr_auto] items-center px-6">
                  <div className="border-2 border-black w-20 aspect-square flex items-center justify-center rounded-full">
                    <PhosphorIconPackage size={42} />
                  </div>
                  <div className="h-1 w-full [background-color:_#A4D8D8]"></div>
                  <div className="border-2 border-black w-20 aspect-square flex items-center justify-center rounded-full">
                    <Truck size={42} />
                  </div>
                  <div className="h-1 w-full [background-color:_#A4D8D8]"></div>
                  <div className="border-2 border-black w-20 aspect-square flex items-center justify-center rounded-full">
                    <Path size={42} />
                  </div>
                  <div className="h-1 w-full [background-color:_#A4D8D8]"></div>
                  <div className="border-2 border-black w-20 aspect-square flex items-center justify-center rounded-full">
                    <MapPinLine size={42} />
                  </div>
                </div>
                <div className="grid grid-cols-[repeat(4,_8rem)] justify-between">
                  <div className="text-center">Handed Over</div>
                  <div className="text-center">In Transit</div>
                  <div className="text-center">Out for Delivery</div>
                  <div className="w-30 text-center">Delivered</div>
                </div>
              </div>
              <div>
                <div>
                  {isVisibleStatusLogs && (
                    <LogEntries packageId={_package.id} />
                  )}
                  <div className="text-center">
                    {isVisibleStatusLogs ? (
                      <button
                        type="button"
                        onClick={() => setIsVisibleStatusLogs(false)}
                      >
                        <CaretUp size={32} />
                      </button>
                    ) : (
                      <button type="button">
                        <CaretDown
                          size={32}
                          onClick={() => setIsVisibleStatusLogs(true)}
                        />
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 pt-6 px-6 border-t border-gray-300">
                  <div>
                    <p className="font-medium">Recipient Address</p>
                    <p>{_package.receiverFullName}</p>
                    <p className="text-gray-500 text-sm">
                      {_package.receiverContactNumber}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {_package.receiverStreetAddress}, Brgy.{" "}
                      {_package.receiverBarangay},
                    </p>
                    <p className="text-gray-500 text-sm">
                      {_package.receiverCity},{" "}
                      {_package.receiverStateOrProvince}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {_package.receiverCountryCode},{" "}
                      {_package.receiverPostalCode}
                    </p>
                    {(_package.proofOfDeliveryImgUrl ||
                      _package.proofOfDeliverySignatureUrl) && (
                      <>
                        <p className="font-medium mt-3">Proof of Delivery</p>

                        <p>
                          {_package.proofOfDeliveryImgUrl && (
                            <a
                              href={_package.proofOfDeliveryImgUrl}
                              target="_blank"
                              className="text-gray-500 text-sm hover:underline"
                            >
                              View photo
                            </a>
                          )}

                          {_package.proofOfDeliverySignatureUrl && (
                            <a
                              href={_package.proofOfDeliverySignatureUrl}
                              target="_blank"
                              className="text-gray-500 text-sm ml-3 hover:underline"
                            >
                              View signature
                            </a>
                          )}
                        </p>
                      </>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Sender</p>
                    <p>{_package.senderFullName}</p>
                    <p className="text-gray-500 text-sm">
                      {_package.senderContactNumber}
                    </p>
                    <p className="font-medium mt-2">
                      Failed Attempts:{" "}
                      <span className="text-gray-500 text-sm">
                        {_package.failedAttempts}
                      </span>
                    </p>
                    {_package.declaredValue === null ? (
                      <p className="font-medium mt-2">
                        Insured?{" "}
                        <span className="text-gray-500 text-sm">No</span>
                      </p>
                    ) : (
                      <p className="font-medium mt-2">
                        Insured?{" "}
                        <span className="text-gray-500 text-sm">Yes</span>
                      </p>
                    )}
                    {_package.declaredValue && (
                      <p className="font-medium">
                        Declared value:{" "}
                        <span className="text-gray-500 text-sm">
                          ₱{_package.declaredValue}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
