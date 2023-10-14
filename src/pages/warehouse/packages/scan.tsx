import React from "react"
import { WarehouseLayout } from "@/layouts/warehouse"
import { useSession } from "@/utils/auth"
import { Plus } from "@phosphor-icons/react/Plus"
import { MagnifyingGlass } from "@phosphor-icons/react/MagnifyingGlass"
import { DownloadSimple } from "@phosphor-icons/react/DownloadSimple"
import { Export } from "@phosphor-icons/react/Export"
import { CaretDoubleLeft } from "@phosphor-icons/react/CaretDoubleLeft"
import { CaretLeft } from "@phosphor-icons/react/CaretLeft"
import { CaretDoubleRight } from "@phosphor-icons/react/CaretDoubleRight"
import { CaretRight } from "@phosphor-icons/react/CaretRight"
import { ArrowsDownUp } from "@phosphor-icons/react/ArrowsDownUp"
import { DotsThree } from "@phosphor-icons/react/DotsThree"

function PackageScanTile() {
  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[24rem] col-span-2 ">
      <div className="mb-5">
        <div
          style={{ borderBottom: "1px solid #C9C1C1" }}
          className="flex justify-between pt-1 "
        >
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
            <button className="font-light text-gray-400	">Outgoing</button>
          </div>
        </div>
      </div>

      <div className="text-sm">
        <table className="min-w-full	text-left">
          <tbody>
            <tr>
              <td className="px-8">
                <label className="font-bold" style={{ fontSize: "20px" }}>
                  Scan Barcode
                </label>{" "}
                <input
                  style={{ border: "1px solid #78CFDC", borderRadius: "10px" }}
                  className="p-2 w-full mt-2"
                  placeholder="Tracking No."
                ></input>
              </td>
              <td className="px-8">
                <label className="font-bold	mb-4" style={{ fontSize: "20px" }}>
                  Change Status
                </label>{" "}
                <select
                  style={{ border: "1px solid #78CFDC", borderRadius: "10px" }}
                  className="p-2 w-full mt-2"
                  placeholder="Location Set"
                >
                  <option selected>--Select Location--</option>
                  <option>In Warehouse</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="mt-9">
          <div>
            <h2 style={{ fontSize: "20px" }} className="font-bold">
              Package List
            </h2>
          </div>
          <table className="w-full border-separate border-spacing-4">
            <thead>
              <tr>
                <th className="p-3">
                  <input type="checkbox"></input> No.
                </th>
                <th className="p-3">Package ID</th>
                <th className="p-3">Package Sender</th>
                <th className="p-3">Package Receiver</th>
                <th className="p-3">Address</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-center">
              <tr>
                <td>
                  <input type="checkbox"></input> <span>01</span>
                </td>
                <td>1230495</td>
                <td>John Doe</td>
                <td>john Dela Cruz</td>
                <td>25 Brgy. Gulod Novaliches, Quezon City, NCR, 1121</td>
                <td>
                  <div
                    style={{
                      backgroundColor: "#C73DCA",
                      borderRadius: "10px",
                      color: "white",
                    }}
                    className="p-1"
                  >
                    In Warehouse
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <input type="checkbox"></input> <span>02</span>
                </td>
                <td>1230495</td>
                <td>John Doe</td>
                <td>john Dela Cruz</td>
                <td>25 Brgy. Gulod Novaliches, Quezon City, NCR, 1121</td>
                <td>
                  <div
                    style={{
                      backgroundColor: "#C73DCA",
                      borderRadius: "10px",
                      color: "white",
                    }}
                    className="p-1"
                  >
                    In Warehouse
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <input type="checkbox"></input> <span>03</span>
                </td>
                <td>1230495</td>
                <td>John Doe</td>
                <td>john Dela Cruz</td>
                <td>25 Brgy. Gulod Novaliches, Quezon City, NCR, 1121</td>
                <td>
                  <div
                    style={{
                      backgroundColor: "#C73DCA",
                      borderRadius: "10px",
                      color: "white",
                    }}
                    className="p-1"
                  >
                    In Warehouse
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <input type="checkbox"></input> <span>04</span>
                </td>
                <td>1230495</td>
                <td>John Doe</td>
                <td>john Dela Cruz</td>
                <td>25 Brgy. Gulod Novaliches, Quezon City, NCR, 1121</td>
                <td>
                  <div
                    style={{
                      backgroundColor: "#C73DCA",
                      borderRadius: "10px",
                      color: "white",
                    }}
                    className="p-1"
                  >
                    In Warehouse
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </article>
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

        <section className="grid grid-cols-1 gap-x-11 [color:_#404040] mb-6">
          <PackageScanTile />
        </section>
      </WarehouseLayout>
    </>
  )
}

export default Scan
