import type { DeliveryShipment, Vehicle } from "@/server/db/entities"

type VehicleStatus = {
  delivery_shipments: DeliveryShipment | null
  vehicles: Vehicle
}[]

export function VehicleStatusTile(props: { vehicleStatuses: VehicleStatus }) {
  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[20rem] overflow-auto">
      <h2 className="font-semibold mb-2">Vehicle Status</h2>
      <table className="table-fixed w-full text-sm border-separate border-spacing-y-1">
        <thead>
          <tr>
            <td className="text-black font-bold">Vehicle</td>
            <td className="text-black font-bold flex justify-center">Status</td>
          </tr>
        </thead>
        <tbody>
          {props.vehicleStatuses.length === 0 ? (
            <>No Vehicle Found.</>
          ) : (
            <>
              {props.vehicleStatuses.map((vehicleStatus) => (
                <tr key={vehicleStatus.vehicles.id}>
                  <td>
                    {vehicleStatus.vehicles.displayName} (
                    {vehicleStatus.vehicles.plateNumber})
                  </td>
                  <td>
                    {vehicleStatus.vehicles.isMaintenance === 1 ? (
                      <div className="flex justify-center	">
                        <span className="uppercase font-bold	text-white	">
                          Maintenance
                        </span>
                      </div>
                    ) : (
                      <div className="flex justify-center	">
                        {vehicleStatus.delivery_shipments === null ? (
                          <span className="uppercase font-bold	px-3 py-1 rounded-lg text-white		bg-[#3DE074]">
                            Available
                          </span>
                        ) : (
                          <span className="uppercase font-bold	px-3 py-1 rounded-lg text-white		bg-[#F17834]">
                            Scheduled
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </article>
  )
}
