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
              style={{
                color: "#79CFDC",
                fontWeight: "700",
                borderBottom: "3px solid #78CFDC",
              }}
              className="mr-7"
            >
              Incoming
            </button>
            <button
              onClick={() => {
                switchTab()
              }}
              className="font-light text-gray-400	"
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
  const disableScannerCont = useContext(DisableScanner) === "false"

  const {
    isLoading,
    isError,
    data: packages,
  } = api.package.getByIds.useQuery(
    {
      list: packageIds,
    },
    {
      enabled: user !== null && role === "WAREHOUSE",
    },
  )

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
  }, [disableScannerCont])

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
                    console.log("empty")
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
                disabled={disableScannerCont || packageIds.length !== 0}
                value={selectedChangeStatus[1]}
                onChange={(e) => {
                  const value = e.currentTarget.value

                  if (value === "0") {
                    setSelectedChangeStatus(["true", "0"])
                  } else {
                    setSelectedChangeStatus(["false", value])
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
                <option>In Warehouse</option>
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
                              setCheckedIds((CurrentCheckedIds) => {
                                return [...CurrentCheckedIds, id]
                              })
                            } else {
                              setCheckedIds((CurrentCheckedIds) => {
                                return CurrentCheckedIds.filter((CheckedId) => {
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
                return currCheckedIds.filter((CheckedId) => {
                  return !checkedIds.includes(CheckedId)
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
            style={{
              border: "2px solid transparent",
              borderRadius: "10px",
            }}
            className="px-3 py-1 text-white duration-500 [background:_#79CFDC] hover:opacity-75 hover:text-black hover:"
          >
            Save
          </button>
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
  const [isChecked, setisChecked] = useState(false)

  useEffect(() => {
    if (isAllChecked) {
      setisChecked(true)
    } else {
      if (checkedIds.includes(_package.id)) {
        setisChecked(true)
      } else {
        setisChecked(false)
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
      <td>{_package.id}</td>
      <td>
        <div className="font-bold">
          <p>{_package.senderFullName}</p>
          <p>{_package.receiverFullName}</p>
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
            backgroundColor: "#C73DCA",
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
  return (
    <option value={_shipment.shipment_id}>
      &nbsp;
      {_shipment.shipment_id}&nbsp;
      {_shipment.display_name} &nbsp;{_shipment.country_code}
      &nbsp;
    </option>
  )
}

function ShipmentTile({
  shipmentList,
  children,
  scannedPackageIds,
}: {
  shipmentList: ExtendedShipment[]
  children: any
  scannedPackageIds: number[]
}) {
  const [PackageIds, setPackageIds] = useState<number[]>([])
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
                selectedShipmentResultIds.push(_package.id)

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
  const [Checker, setChecker] = useState(false)

  return (
    <tr>
      <td>
        <p>
          {scannedPackageIds.includes(_package.id) ? (
            <Checks style={{ color: "#79CFDC" }} size={27} weight="bold" />
          ) : (
            <X style={{ color: "#79CFDC" }} size={27} weight="bold" />
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
          style={{ borderRadius: "10px" }}
          className="text-center text-white bg-[#F17834] p-1"
        >
          <p>{_package.status.status}</p>
        </div>
      </td>
    </tr>
  )
}

const DisableScanner = createContext("false")

function Incoming({ switchTab }: { switchTab: () => void }) {
  const { user, role } = useSession()
  const [selectedShipment, setSelectedShipment] = useState("false")
  const [valueId, setValueId] = useState<number>(0)

  const {
    isLoading,
    isError,
    data: shipment,
  } = api.shipment.getAllInTransitStatus.useQuery(undefined, {
    enabled: user !== null && role === "WAREHOUSE",
  })

  const {
    isLoading: isLoadingShipments,
    isError: isErrorShipments,
    data: shipmentList,
  } = api.shipment.getAllById.useQuery(
    {
      id: valueId,
    },
    {
      enabled: user !== null && role === "WAREHOUSE",
    },
  )
  const [scannedPackageIds, setScannedPackageIds] = useState<number[]>([])
  const handleDataFromChild = (data: number[]) => {
    setScannedPackageIds(data)
  }
  return (
    <>
      <WarehouseLayout title="Dashboard">
        <DisableScanner.Provider value={selectedShipment}>
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
              shipmentList={shipmentList as unknown as ExtendedShipment[]}
              scannedPackageIds={scannedPackageIds}
            >
              <select
                onChange={(e) => {
                  const value = parseInt(e.currentTarget.value)
                  if (value == 0) {
                    setValueId(0)
                    setSelectedShipment("false")
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
                        {shipment.map((_shipment) => (
                          <ShipmentSelection
                            key={_shipment.id}
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

export default Incoming
