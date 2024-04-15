import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/server/db/client"
import {
  deliveryShipments,
  drivers,
  packages,
  shipments,
  users,
  vehicles,
} from "@/server/db/schema"
import { and, count, desc, eq, lt, ne, or, asc } from "drizzle-orm"
import { resourceLimits } from "worker_threads"

export async function DriverStatusTile() {
  noStore()
  const result = await db
    .select()
    .from(users)
    .leftJoin(deliveryShipments, eq(users.id, deliveryShipments.driverId))
    .orderBy(desc(deliveryShipments.createdAt))
    .limit(1)
    .leftJoin(vehicles, eq(deliveryShipments.vehicleId, vehicles.id))
    .leftJoin(shipments, eq(deliveryShipments.shipmentId, shipments.id))
    .where(eq(users.role, "DRIVER"))

  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[24rem] overflow-auto">
      <div className="mb-2">
        <div className="flex justify-between">
          <h2 className="font-semibold">Driver Status</h2>
        </div>
      </div>
      <table className="table-fixed w-full text-sm border-separate border-spacing-y-1	">
        <thead>
          <tr className="text-left">
            <th className="text-black font-bold">Driver Name</th>
            <th className="text-black font-bold">Vehicle</th>
            <th className="text-black font-bold">Type</th>
            <th className="text-black font-bold text-center">Status</th>
          </tr>
        </thead>

        <tbody className="">
          {result.map((driver) => (
            <tr key={driver.users.id}>
              <td className="">{driver.users.displayName}</td>
              {driver.delivery_shipments == undefined ||
              driver.vehicles == undefined ||
              driver.shipments?.status === "COMPLETED" ||
              driver.shipments?.status === "FAILED" ? (
                <>
                  <td className="text-gray-400">N/A</td>
                  <td className="text-gray-400">N/A</td>
                  <td className=" uppercase flex justify-center">
                    <span className="bg-[#3DE074] text-white rounded-lg py-1 px-3">
                      Standby
                    </span>
                  </td>
                </>
              ) : (
                <>
                  <td className=" text-gray-400">
                    {driver.vehicles.type} ({driver.vehicles.plateNumber})
                  </td>
                  <td className="text-gray-400">
                    {driver.delivery_shipments.isExpress === 0 ? (
                      <>Standard</>
                    ) : (
                      <>Express</>
                    )}
                  </td>
                  <td className=" uppercase flex justify-center">
                    <span
                      className={
                        driver.shipments?.status === "PREPARING"
                          ? "bg-[#D34DD6] text-white rounded-lg py-1 px-3"
                          : "bg-[#F17834] text-white rounded-lg py-1 px-3"
                      }
                    >
                      {driver.shipments?.status === "PREPARING" ? (
                        <>{driver.shipments.status}</>
                      ) : (
                        <>ON DUTY</>
                      )}
                    </span>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  )
}
