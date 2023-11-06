import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  useRef,
  Children,
} from "react"
import { WarehouseLayout } from "@/layouts/warehouse"
import { api } from "@/utils/api"
import { LoadingSpinner } from "@/components/spinner"
import { Package } from "@/server/db/entities"
import { Shipment } from "@/server/db/entities"
import { useSession } from "@/utils/auth"
import { Checks } from "@phosphor-icons/react/Checks"
import { X } from "@phosphor-icons/react/X"
import { useMutation } from "@tanstack/react-query"
import { ZodNull } from "zod"
import { Familjen_Grotesk } from "next/font/google"

type ExtendedShipment = Shipment & {
  packages: (Package & {
    shipmentId: number
    status: {
      id: number
      createdAt: Date
      createdById: string
      description: string
      status: string
      packageId: number
    }
  })[]
}

let selectedShipmentResultIds = [] as number[]

function PackageScanTile({
  switchTab,
  packageList,
}: {
  switchTab: () => void
  packageList: (data: number[]) => void
}) {
  const [scannedPackageIds, setScannedPackageIds] = useState<number[]>([])
  const handleDataFromChild = (data: number[]) => {
    setScannedPackageIds(data)
  }

  useEffect(() => {
    const sendDataToParent = () => {
      packageList(scannedPackageIds)
    }

    sendDataToParent()
  }, [scannedPackageIds, packageList])

  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[24rem]  ">
      <div className="mb-5">
        <div className="flex justify-between pt-1 ">
          <div style={{ fontSize: "19px" }}>
            <button
              onClick={() => {
                switchTab()
              }}
              className="mr-7 font-light text-gray-400"
            >
              Incoming
            </button>
            <button
              style={{
                color: "#79CFDC",
                fontWeight: "700",
                borderBottom: "3px solid #78CFDC",
              }}
              className="	"
            >
              Outgoing
            </button>
          </div>
        </div>
      </div>

      <ScanTable packageList={handleDataFromChild}></ScanTable>
    </article>
  )
}

function ScanTable(props: { packageList: (data: number[]) => void }) {
  const { user, role } = useSession()
  const [packageIds, setPackageIds] = useState<number[]>([])
  const [isCheckedClearBtn, setIsCheckedClearBtn] = useState(false)
  const [checkedIds, setCheckedIds] = useState<number[]>([])
  const [selectedChangeStatus, setSelectedChangeStatus] = useState([
    "true",
    "0",
  ])
  const [newStatus, setNewStatus] = useState<string>("")
  const [userHub, setUserHub] = useState<string>("")
  const disbaleBtnContext = useContext(DisableScanner)
  const disbaleBtnChecker = disbaleBtnContext.disbaleBtn === "false"
  const selectedShipmentId = disbaleBtnContext.shipmentBtn

  const mutation = api.package.updatePackageStatusByIds.useMutation({
    onSuccess: async () => {
      setPackageIds([])
    },
  })
  const {
    isLoading,
    isError,
    data: packages,
  } = api.package.getByIds.useQuery(
    {
      ids: packageIds,
    },
    {
      enabled: user !== null && role === "WAREHOUSE",
    },
  )
  const { data: currentUser } = api.user.getCurrent.useQuery(undefined, {
    enabled: user !== null && role === "WAREHOUSE",
  })

  function handleChange() {
    if (isCheckedClearBtn === false) {
      setIsCheckedClearBtn(true)
    } else {
      setIsCheckedClearBtn(false)
    }
  }

  useEffect(() => {
    setPackageIds([])
    setSelectedChangeStatus(["true", "0"])
    currentUser?.map((userInfo) => {
      setUserHub(userInfo.shipment_hubs.displayName)
    })
  }, [disbaleBtnChecker, selectedShipmentId, currentUser])

  useEffect(() => {
    const sendDataToParent = () => {
      props.packageList(packageIds)
    }

    sendDataToParent()
  }, [packageIds, props])

  return (
    <div className="text-sm">
      <table className="min-w-full	text-left">
        <tbody>
          <tr>
            <td style={{ minWidth: "150px" }} className="pr-8">
              <label className="font-bold" style={{ fontSize: "14px" }}>
                Scan Barcode
              </label>{" "}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const input = formData.get("trackingNo") as string
                  const packageListFromSelectedShipment = Array.from(
                    new Set(selectedShipmentResultIds),
                  )
                  if (input.length === 0) {
                  } else {
                    const packageId = parseInt(input)

                    packageListFromSelectedShipment.some((_id) => {
                      if (_id === packageId) {
                        setPackageIds((currPackageIds) => {
                          return [...currPackageIds, packageId]
                        })
                      } else {
                      }
                    })
                  }

                  e.currentTarget.reset()
                }}
              >
                <input
                  disabled={selectedChangeStatus[0] === "true"}
                  name="trackingNo"
                  style={{
                    border: "1px solid #A99C9C",
                    borderRadius: "10px",
                    height: "30px",
                  }}
                  className="px-3 w-full mt-2"
                  placeholder="Tracking No."
                ></input>
              </form>
            </td>
            <td className="pr-8">
              <label className="font-bold	mb-4" style={{ fontSize: "14px" }}>
                Change Status
              </label>
              <select
                disabled={disbaleBtnChecker}
                value={selectedChangeStatus[1]}
                onChange={(e) => {
                  const value = e.currentTarget.value

                  if (value === "0") {
                    if (packageIds.length === 0) {
                      setSelectedChangeStatus(["true", "0"])
                      setNewStatus("0")
                    } else {
                      setNewStatus(newStatus)
                    }
                  } else {
                    setSelectedChangeStatus(["false", value])
                    setNewStatus(value)
                  }
                }}
                style={{
                  border: "1px solid #A99C9C",
                  borderRadius: "10px",
                  height: "30px",
                }}
                className="px-3 w-full mt-2"
                placeholder="Location Set"
              >
                <option value={0}>--Select Location--</option>
                <option>Delivering</option>
                <option>Shipping</option>
              </select>
            </td>
            <td className="pr-8">
              <label className="font-bold	mb-4" style={{ fontSize: "14px" }}>
                Location
              </label>
              <input
                style={{
                  border: "1px solid #A99C9C",
                  borderRadius: "10px",
                  height: "30px",
                }}
                className="px-3 w-full mt-2"
                placeholder="Location"
                disabled={true}
                value={userHub}
              ></input>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="mt-9">
        <div>
          <h2 style={{ fontSize: "18px" }} className="font-bold">
            Package List
          </h2>
        </div>
        <div style={{ maxHeight: "350px", overflow: "auto" }}>
          <table
            style={{ fontSize: "13px" }}
            className="w-full border-separate border-spacing-1 text-left mt-3"
          >
            <thead>
              <tr className="uppercase" style={{ fontSize: "13px" }}>
                <th>
                  <input
                    checked={isCheckedClearBtn}
                    onChange={handleChange}
                    type="checkbox"
                  ></input>
                </th>
                <th>Package ID</th>
                <th>Package Information</th>

                <th className="text-center">Update to</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {isLoading ? (
                <tr className="flex justify-center pt-4"></tr>
              ) : (
                <>
                  {isError ? (
                    <tr>Error :{"("}</tr>
                  ) : (
                    <>
                      {packages.map((_package) => (
                        <TableItem
                          SelectedStatus={selectedChangeStatus[1]}
                          checkedIds={checkedIds}
                          key={_package.id}
                          package={_package}
                          isAllChecked={isCheckedClearBtn}
                          setCheckedId={({ id, isChecked }) => {
                            if (isChecked === true) {
                              setCheckedIds((currentCheckedIds) => {
                                return [...currentCheckedIds, id]
                              })
                            } else {
                              setCheckedIds((currentCheckedIds) => {
                                return currentCheckedIds.filter((CheckedId) => {
                                  return id !== CheckedId
                                })
                              })
                            }
                          }}
                        ></TableItem>
                      ))}
                    </>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
        <div
          style={
            packageIds.length !== 0 ? { display: "flex" } : { display: "none" }
          }
          className="flex justify-end px-3 mt-4"
        >
          <button
            onClick={() => {
              setPackageIds((currPackageIds) => {
                return currPackageIds.filter((packageId) => {
                  return !checkedIds.includes(packageId)
                })
              })

              setCheckedIds((currCheckedIds) => {
                return currCheckedIds.filter((checkedId) => {
                  return !checkedIds.includes(checkedId)
                })
              })
              if (isCheckedClearBtn) {
                setPackageIds([])
                setCheckedIds([])
                setIsCheckedClearBtn(false)
              }
            }}
            style={{ border: "2px solid #79CFDC", borderRadius: "10px" }}
            className="px-3 py-1 mr-6"
          >
            Clear
          </button>
          <button
            onClick={(e) => {
              mutation.mutate({ ids: packageIds, status: newStatus })
            }}
            style={{
              border: "2px solid transparent",
              borderRadius: "10px",
            }}
            className="px-3 py-1 text-white duration-500 [background:_#79CFDC] hover:opacity-75 hover:text-black hover:"
          >
            Save
          </button>
          {mutation.isLoading ? <LoadingSpinner></LoadingSpinner> : null}
        </div>
      </div>
    </div>
  )
}

function TableItem({
  package: _package,
  isAllChecked,
  setCheckedId,
  checkedIds,
  SelectedStatus,
}: {
  package: Package
  isAllChecked: boolean
  setCheckedId: (checkedId: { id: number; isChecked: boolean }) => void
  checkedIds: number[]
  SelectedStatus: string
}) {
  const [isChecked, setIsChecked] = useState(false)

  useEffect(() => {
    if (isAllChecked) {
      setIsChecked(true)
    } else {
      if (checkedIds.includes(_package.id)) {
        setIsChecked(true)
      } else {
        setIsChecked(false)
      }
    }
  }, [isAllChecked, _package.id, checkedIds])
  return (
    <tr className="text-left">
      <td>
        <input
          checked={isChecked}
          onChange={(e) => {
            setCheckedId({
              id: _package.id,
              isChecked: e.currentTarget.checked,
            })
          }}
          value={_package.id}
          type="checkbox"
        ></input>
      </td>
      <td className="font-bold">{_package.id}</td>
      <td>
        <div className="font-bold">
          <p>S: {_package.senderFullName}</p>
          <p>R: {_package.receiverFullName}</p>
        </div>

        <div style={{ fontSize: "11px" }} className="break-words">
          <p>
            {_package.receiverStreetAddress}&nbsp;
            {_package.receiverBarangay}&nbsp;
          </p>
          <p>
            {_package.receiverCity}&nbsp;
            {_package.receiverStateOrProvince}&nbsp;
            {_package.receiverCountryCode}&nbsp;
          </p>
        </div>
      </td>
      <td>
        <div
          style={{
            backgroundColor: "#F17834",
            borderRadius: "10px",
            color: "white",
          }}
          className="p-1 text-center"
        >
          {SelectedStatus}
        </div>
      </td>
    </tr>
  )
}

function ShipmentSelection({ shipment: _shipment }: { shipment: any }) {
  const { user, role } = useSession()
  let destionationHub = ""
  const {
    isLoading,
    isError,
    data: destionationName,
  } = api.shipment.getDestinationNameById.useQuery(
    {
      id: _shipment.origin_hub_id,
    },
    {
      enabled: user !== null && role === "WAREHOUSE",
    },
  )
  if (destionationName !== undefined) {
    destionationHub = destionationName[0].displayName
  }
  return (
    <option value={_shipment.shipment_id}>
      &nbsp;
      {_shipment.shipment_id}&nbsp;
      {destionationHub} To {_shipment.display_name}
    </option>
  )
}

function ShipmentTile({
  shipmentList,
  children,
  scannedPackageIds,
  shipmentRefetch,
}: {
  shipmentList: ExtendedShipment[]
  children: any
  scannedPackageIds: number[]
  shipmentRefetch: (data: boolean) => void
}) {
  const disableBtnContext = useContext(DisableScanner)
  const selectedShipmentId = disableBtnContext.shipmentBtn
  const mutation = api.shipment.updateStatusToInTransit.useMutation({
    onSuccess: () => {
      if (shipmentRefetcher) {
        setShipmentRefetcher(false)
      } else {
        setShipmentRefetcher(true)
      }
    },
  })
  const checkAllStatus = [] as string[]
  const [shipmentRefetcher, setShipmentRefetcher] = useState<boolean>(false)

  useEffect(() => {
    const refetchShipmentId = () => {
      shipmentRefetch(shipmentRefetcher)
    }

    refetchShipmentId()
  }, [shipmentRefetcher, shipmentRefetch])

  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[24rem]  ">
      <div className="mt-4 text-sm">
        <h2 style={{ fontSize: "14px" }} className="font-bold">
          Shipments
        </h2>
        {children}
      </div>
      <div className="mt-6">
        <h2 style={{ fontSize: "18px" }} className="font-bold">
          Package List
        </h2>
        <table
          style={{ fontSize: "13px" }}
          className="w-full border-separate border-spacing-1 text-left mt-3"
        >
          <thead className="uppercase">
            <tr>
              <th></th>
              <th>Package ID</th>
              <th>Package Information</th>
              <th className="text-center">Current Status</th>
            </tr>
          </thead>
          <tbody>
            {shipmentList === undefined ? (
              <></>
            ) : (
              shipmentList[0]?.packages?.map((_package) => {
                checkAllStatus.push(_package.status.status)

                if (_package.status.status === "IN_WAREHOUSE") {
                  selectedShipmentResultIds.push(_package.id)
                }
                return (
                  <ShipmentItem
                    scannedPackageIds={scannedPackageIds}
                    key={_package.id}
                    package={_package}
                  ></ShipmentItem>
                )
              })
            )}
          </tbody>
        </table>

        <div
          style={
            checkAllStatus.length === 0
              ? { display: "none" }
              : { display: "flex" }
          }
          className="flex justify-end mt-6"
        >
          {mutation.isLoading ? <LoadingSpinner></LoadingSpinner> : <></>}
          <button
            onClick={() => {
              if (!checkAllStatus.includes("IN_WAREHOUSE")) {
                mutation.mutate({ id: selectedShipmentId })
              }
            }}
            disabled={checkAllStatus.includes("IN_WAREHOUSE")}
            style={
              checkAllStatus.includes("IN_WAREHOUSE")
                ? { borderRadius: "10px", opacity: "0.7" }
                : { borderRadius: "10px", opacity: "1" }
            }
            className="bg-[#79CFDC] text-white px-4 py-1 text-sm hover:opacity-75"
          >
            Mark as Shipped
          </button>
        </div>
      </div>
    </article>
  )
}

function ShipmentItem({
  package: _package,
  scannedPackageIds,
}: {
  package: any
  scannedPackageIds: number[]
}) {
  return (
    <tr>
      <td>
        <p>
          {scannedPackageIds.includes(_package.id) ||
          _package.status.status !== "IN_WAREHOUSE" ? (
            <Checks style={{ color: "green" }} size={27} weight="bold" />
          ) : (
            <X style={{ color: "red" }} size={27} weight="bold" />
          )}
        </p>
      </td>
      <td className="font-bold">{_package.id}</td>
      <td>
        <div className="font-bold">
          <p>S: {_package.senderFullName}</p>
          <p>R: {_package.receiverFullName}</p>
        </div>

        <div style={{ fontSize: "11px" }} className="break-words">
          <p>
            {_package.receiverStreetAddress}&nbsp;
            {_package.receiverBarangay}&nbsp;
          </p>
          <p>
            {_package.receiverCity}&nbsp;
            {_package.receiverStateOrProvince}&nbsp;
            {_package.receiverCountryCode}&nbsp;
          </p>
        </div>
      </td>
      <td>
        <div
          style={
            _package.status.status !== "SHIPPING"
              ? { backgroundColor: "#C73DCA", borderRadius: "10px" }
              : { backgroundColor: "#F17834", borderRadius: "10px" }
          }
          className="text-center text-white bg-[#F17834] p-1"
        >
          <p>{_package.status.status.replaceAll("_", " ")}</p>
        </div>
      </td>
    </tr>
  )
}

const DisableScanner = createContext({
  disbaleBtn: "false",
  shipmentBtn: 0,
})

function Outgoing({ switchTab }: { switchTab: () => void }) {
  const { user, role } = useSession()
  const [selectedShipment, setSelectedShipment] = useState("false")
  const [valueId, setValueId] = useState<number>(0)
  const [scannedPackageIds, setScannedPackageIds] = useState<number[]>([])
  const [disableShipmentSelection, setDisableShipmentSelection] =
    useState(false)
  const [refetchShipmentId, setRefetchShipmentId] = useState<boolean>(false)
  const {
    refetch: refetchShipmentSelection,
    isLoading,
    isError,
    data: shipment,
  } = api.shipment.getOutgoing.useQuery(undefined, {
    enabled: user !== null && role === "WAREHOUSE",
  })

  const {
    refetch,
    isLoading: isLoadingShipments,
    isError: isErrorShipments,
    data: shipmentList,
  } = api.shipment.getWithShipmentPackagesById.useQuery(
    {
      id: valueId,
    },
    {
      enabled: user !== null && role === "WAREHOUSE",
    },
  )

  const handleDataFromChild = (data: number[]) => {
    setScannedPackageIds(data)
  }
  const shipmentRefetcher = (data: boolean) => {
    setRefetchShipmentId(data)
  }

  useEffect(() => {
    setValueId(0)
    refetchShipmentSelection()
  }, [refetchShipmentId, refetchShipmentSelection])

  useEffect(() => {
    if (scannedPackageIds.length === 0) {
      setDisableShipmentSelection(false)
      refetch()
    } else {
      setDisableShipmentSelection(true)
    }
  }, [scannedPackageIds, refetch])

  return (
    <>
      <WarehouseLayout title="Dashboard">
        <DisableScanner.Provider
          value={{
            disbaleBtn: selectedShipment,
            shipmentBtn: valueId,
          }}
        >
          <div className="flex	justify-between	my-4">
            <h1 className="text-3xl font-black [color:_#00203F] mb-4 mt-6">
              Package Scan
            </h1>
          </div>
          <section className="grid grid-cols-2 gap-11 [color:_#404040] mb-6">
            <PackageScanTile
              packageList={handleDataFromChild}
              switchTab={switchTab}
            />
            <ShipmentTile
              shipmentRefetch={shipmentRefetcher}
              shipmentList={shipmentList as unknown as ExtendedShipment[]}
              scannedPackageIds={scannedPackageIds}
            >
              <select
                value={valueId}
                disabled={disableShipmentSelection}
                onChange={(e) => {
                  const value = parseInt(e.currentTarget.value)

                  if (value == 0) {
                    setValueId(0)

                    setSelectedShipment("false")
                    selectedShipmentResultIds.length = 0
                  } else {
                    setSelectedShipment("true")
                    setValueId(value)
                  }
                }}
                style={{
                  border: "1px solid #A99C9C",
                  borderRadius: "10px",
                  height: "30px",
                  minWidth: "200px",
                  maxWidth: "100%",
                }}
                className="px-3 mt-2"
                placeholder="Location Set"
              >
                <option value={0}>--Select Shipment--</option>
                {isLoading ? (
                  <option>...</option>
                ) : (
                  <>
                    {isError ? (
                      <option>Error</option>
                    ) : (
                      <>
                        {shipment.map((_shipment, index) => (
                          <ShipmentSelection
                            key={index}
                            shipment={_shipment}
                          ></ShipmentSelection>
                        ))}
                      </>
                    )}
                  </>
                )}
              </select>
            </ShipmentTile>
          </section>
        </DisableScanner.Provider>
      </WarehouseLayout>
    </>
  )
}

export default Outgoing
