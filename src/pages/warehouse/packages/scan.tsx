import React, { useEffect, useState } from "react"
import { WarehouseLayout } from "@/layouts/warehouse"
import { api } from "@/utils/api"
import { LoadingSpinner } from "@/components/spinner"
import { Package } from "@/server/db/entities"
import { useSession } from "@/utils/auth"

function PackageScanTile() {
  const [category, setCategory] = useState("OUTGOING")

  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[24rem]  ">
      <div className="mb-5">
        <div className="flex justify-between pt-1 ">
          <div style={{ fontSize: "19px" }}>
            <button
              onClick={() => {
                setCategory("OUTGOING")
              }}
              style={
                category === "OUTGOING"
                  ? {
                      color: "#79CFDC",
                      fontWeight: "700",
                      borderBottom: "3px solid #78CFDC",
                    }
                  : {}
              }
              className="mr-7"
            >
              Incoming
            </button>
            <button
              onClick={() => {
                setCategory("INCOMING")
              }}
              style={
                category === "INCOMING"
                  ? {
                      color: "#79CFDC",
                      fontWeight: "700",
                      borderBottom: "3px solid #78CFDC",
                    }
                  : {}
              }
              className="font-light text-gray-400	"
            >
              Outgoing
            </button>
          </div>
        </div>
      </div>

      <Tablescan></Tablescan>
    </article>
  )
}

function Tablescan() {
  const { user, role } = useSession()
  const [packageIds, setPackageIds] = useState<number[]>([])

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
  const [isCheckedClearBtn, setIsCheckedClearBtn] = useState(false)
  const [checkedIds, setCheckedIds] = useState<number[]>([])
  function handleChange() {
    if (isCheckedClearBtn === false) {
      setIsCheckedClearBtn(true)
      console.log("CHECKED")
    } else {
      setIsCheckedClearBtn(false)
      console.log("UNCHECKED")
    }
  }

  return (
    <div className="text-sm">
      <table className="min-w-full	text-left">
        <tbody>
          <tr>
            <td className="px-8">
              <label className="font-bold" style={{ fontSize: "14px" }}>
                Scan Barcode
              </label>{" "}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  console.log(formData.get("trackingNo"))
                  const input = formData.get("trackingNo") as string

                  if (input.length === 0) {
                    console.log("empty")
                  } else {
                    const packageId = parseInt(input)
                    setPackageIds((currPackageIds) => {
                      return [...currPackageIds, packageId]
                    })
                  }

                  e.currentTarget.reset()
                }}
              >
                <input
                  name="trackingNo"
                  style={{
                    border: "1px solid #78CFDC",
                    borderRadius: "10px",
                    height: "30px",
                  }}
                  className="px-3 w-full mt-2"
                  placeholder="Tracking No."
                ></input>
              </form>
            </td>
            <td className="px-8">
              <label className="font-bold	mb-4" style={{ fontSize: "14px" }}>
                Change Status
              </label>
              <select
                style={{
                  border: "1px solid #78CFDC",
                  borderRadius: "10px",
                  height: "30px",
                }}
                className="px-3 w-full mt-2"
                placeholder="Location Set"
              >
                <option>--Select Location--</option>
                <option>In Warehouse</option>
              </select>
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

              <th>Updated</th>
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
}: {
  package: Package
  isAllChecked: boolean
  setCheckedId: (checkedId: { id: number; isChecked: boolean }) => void
  checkedIds: number[]
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
          In Warehouse
        </div>
      </td>
    </tr>
  )
}

function ShipmentTile() {
  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[24rem]  "></article>
  )
}

function Scan() {
  return (
    <>
      <WarehouseLayout title="Dashboard">
        <div className="flex	justify-between	my-4">
          <h1 className="text-3xl font-black [color:_#00203F] mb-4 mt-6">
            Package Scan
          </h1>
        </div>

        <section className="grid grid-cols-2 gap-11 [color:_#404040] mb-6">
          <PackageScanTile />
          <ShipmentTile />
        </section>
      </WarehouseLayout>
    </>
  )
}

export default Scan
