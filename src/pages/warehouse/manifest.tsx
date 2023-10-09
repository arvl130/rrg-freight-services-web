import { WarehouseLayout } from "@/layouts/warehouse"
import { useSession } from "@/utils/auth"
import { Plus } from "@phosphor-icons/react/Plus"
import { Package } from "@phosphor-icons/react/Package"
import { MagnifyingGlass } from "@phosphor-icons/react/MagnifyingGlass"
import { DownloadSimple } from "@phosphor-icons/react/DownloadSimple"
import { Export } from "@phosphor-icons/react/Export"
import { CaretDoubleLeft } from "@phosphor-icons/react/CaretDoubleLeft"
import { CaretLeft } from "@phosphor-icons/react/CaretLeft"
import { CaretDoubleRight } from "@phosphor-icons/react/CaretDoubleRight"
import { CaretRight } from "@phosphor-icons/react/CaretRight"
import { ArrowsDownUp } from "@phosphor-icons/react/ArrowsDownUp"
import { DotsThree } from "@phosphor-icons/react/DotsThree"

function RecentActivityTile() {
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
              All Manifest
            </button>
            <button className="font-light text-gray-400	">
              Archive Manifest
            </button>
          </div>
          <div className="flex">
            <div className="flex items-center	">
              <p>Showing</p>
              <select
                placeholder="All"
                style={{
                  border: "1px solid gray",
                  width: "60px",
                  outline: "none",
                  borderRadius: "5px",
                }}
                className="ml-2 mr-2"
              >
                <option>All</option>
              </select>
              <p>Entries</p>
            </div>
            <div className="flex items-center ml-5">
              <button>
                <CaretDoubleLeft size={15} />
              </button>
              <button>
                <CaretLeft size={15} />
              </button>
              {/* Pager */}
              <div>
                <p style={{ fontSize: "13px" }} className="text-slate-400	">
                  1 2 3 4 5 ... 10
                </p>
              </div>
              <button>
                <CaretRight size={15} />
              </button>
              <button>
                <CaretDoubleRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="text-sm">
        <table className="min-w-full	text-left">
          <thead
            className="uppercase"
            style={{ fontSize: "15px", borderBottom: "1px solid #C9C1C1" }}
          >
            <tr>
              <th className="flex items-center	">
                <input type="checkbox"></input> &nbsp; Manifest
                <button>
                  <ArrowsDownUp size={15} />
                </button>
              </th>
              <th>Sender</th>
              <th>Reciever</th>
              <th>Origin Country</th>
              <th>Arrived Date</th>
              <th className="flex items-center	">
                Status
                <button>
                  <ArrowsDownUp size={15} />
                </button>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              className=""
              style={{ height: "50px", borderBottom: "1px solid #C9C1C1" }}
            >
              <td className="	">
                <p>
                  <input type="checkbox"></input> &nbsp; <span>1234095</span>
                </p>
              </td>
              <td>
                <h2 className="font-bold	">John Doe</h2>
                <p style={{ fontSize: "11px" }} className="">
                  48 Howard Dr. Ocoee, FL 34761
                </p>
              </td>
              <td>
                <h2 className="font-bold	">John Dela Cruz</h2>
                <p style={{ fontSize: "11px" }} className="">
                  25 Brgy. Gulod Novaliches Quezon City
                </p>
              </td>
              <td>
                <h2 className="font-bold	">DUBAI</h2>
              </td>
              <td>
                <h2 className="font-bold	">October 1, 2023 19:01</h2>
              </td>
              <td>
                <div
                  style={{ backgroundColor: "#A19D97", borderRadius: "10px" }}
                  className="px-2 py-0.5 text-center text-white		"
                >
                  <p>Preparing</p>
                </div>
              </td>
              <td>
                <button>
                  <DotsThree size={32} />
                </button>
              </td>
            </tr>
            <tr
              className=""
              style={{ height: "50px", borderBottom: "1px solid #C9C1C1" }}
            >
              <td className="	">
                <p>
                  <input type="checkbox"></input> &nbsp; <span>1234095</span>
                </p>
              </td>
              <td>
                <h2 className="font-bold	">John Doe</h2>
                <p style={{ fontSize: "11px" }} className="">
                  48 Howard Dr. Ocoee, FL 34761
                </p>
              </td>
              <td>
                <h2 className="font-bold	">John Dela Cruz</h2>
                <p style={{ fontSize: "11px" }} className="">
                  25 Brgy. Gulod Novaliches Quezon City
                </p>
              </td>
              <td>
                <h2 className="font-bold	">JAPAN</h2>
              </td>
              <td>
                <h2 className="font-bold	">October 1, 2023 19:01</h2>
              </td>
              <td>
                <div
                  style={{ backgroundColor: "#F17834", borderRadius: "10px" }}
                  className="px-2 py-0.5 text-center text-white		"
                >
                  <p>Our for Delivery</p>
                </div>
              </td>
              <td>
                <button>
                  <DotsThree size={32} />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  )
}

function SearchBar() {
  return (
    <div className="flex justify-between gap-3 bg-white px-6 py-4 rounded-lg shadow-md shadow-brand-cyan-500 mb-6">
      <div className="grid grid-cols-[1fr_2.25rem] h-[2.375rem]">
        <input
          type="text"
          className="rounded-l-lg px-3 border-l border-y border-brand-cyan-500 py-1.5 text-sm"
          placeholder="Quick search"
        />
        <button
          type="button"
          className="text-white bg-brand-cyan-500 flex justify-center items-center rounded-r-lg border-r border-y border-brand-cyan-500"
        >
          <span className="sr-only">Search</span>
          <MagnifyingGlass size={16} />
        </button>
      </div>
      <div className="flex gap-3 text-sm">
        <select className="bg-white border border-gray-300 px-2 py-1.5 w-32 rounded-md text-gray-400 font-medium">
          <option value="">Status</option>
        </select>
        <select className="bg-white border border-gray-300 px-2 py-1.5 w-32 rounded-md text-gray-400 font-medium">
          <option value="">Warehouse</option>
        </select>
        <select className="bg-white border border-gray-300 px-2 py-1.5 w-32 rounded-md text-gray-400 font-medium">
          <option value="">City</option>
        </select>
        <button
          type="button"
          className="bg-white border border-gray-300 px-3 py-1.5 rounded-md text-gray-400 font-medium"
        >
          Clear Filter
        </button>
      </div>
      <div className="flex gap-3 text-sm">
        <button
          type="button"
          className="flex items-center gap-1 bg-brand-cyan-500 text-white px-6 py-2 font-medium"
        >
          <DownloadSimple size={16} />
          <span>Import</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-1 bg-brand-cyan-500 text-white px-6 py-2 font-medium"
        >
          <Export size={16} />
          <span>Export</span>
        </button>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { isLoading, role } = useSession({
    required: {
      role: "WAREHOUSE",
    },
  })

  if (isLoading || role !== "WAREHOUSE") return <>...</>

  return (
    <WarehouseLayout title="Dashboard">
      <div className="flex	justify-between	my-4">
        <h1 className="text-3xl font-black [color:_#00203F] mb-4">
          Manifest List
        </h1>
        <button
          style={{ backgroundColor: "#79CFDC", borderRadius: "5px" }}
          className="flex items-center text-white px-3	"
        >
          {" "}
          <Plus size={20} />
          &nbsp; Create Manifest
        </button>
      </div>
      <SearchBar />

      <section className="mb-6"></section>

      <section className="grid grid-cols-1 gap-x-11 [color:_#404040] mb-6">
        <RecentActivityTile />
      </section>
    </WarehouseLayout>
  )
}
