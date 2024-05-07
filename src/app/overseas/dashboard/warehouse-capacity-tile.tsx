"use client"

import { db } from "@/server/db/client"
import { Bar, Doughnut } from "react-chartjs-2"
import type { Chart } from "chart.js"
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js"
import type { Package, Warehouse } from "@/server/db/entities"

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement)

function Percentage(accumulated: number, capacity: number) {
  let percent = (accumulated / capacity) * 100
  return percent
}

type PackageVolume = { warehouseId: number; totalVolume: number }

export function WarehouseCapacityTile(props: {
  warehouses: Warehouse[]
  packages: PackageVolume[]
}) {
  const findIndexByWarehouseId = (id: number) => {
    return props.packages.findIndex((item) => item.warehouseId === id)
  }

  const labels = ["JAN", "FEB"]

  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[24rem] overflow-auto">
      <h2 className="font-semibold mb-2">Warehouse Capacity</h2>
      <div className="grid lg:grid-cols-[15rem_15rem]  justify-center items-center	 gap-x-6 gap-y-4 min-h-fit max-h-96	">
        {props.warehouses.map((warehouse) => (
          <div key={warehouse.id}>
            <h2 className="text-center py-2 font-bold">
              {warehouse.displayName}
            </h2>
            <Doughnut
              data={{
                labels,
                datasets: [
                  {
                    label: "Packages",
                    data: [
                      Percentage(
                        props.packages[findIndexByWarehouseId(warehouse.id)]
                          .totalVolume,
                        warehouse.volumeCapacityInCubicMeter,
                      ),
                      Percentage(
                        props.packages[findIndexByWarehouseId(warehouse.id)]
                          .totalVolume,
                        warehouse.volumeCapacityInCubicMeter,
                      ) - 100,
                    ],
                    backgroundColor: [
                      `${
                        Percentage(
                          props.packages[findIndexByWarehouseId(warehouse.id)]
                            .totalVolume,
                          warehouse.volumeCapacityInCubicMeter,
                        ) < warehouse.targetUtilization
                          ? "rgba(255, 99, 132, 0.5)"
                          : "rgb(241, 91, 86)"
                      }`,

                      "rgb(226,226,226)",
                    ],
                  },
                ],
              }}
              plugins={[
                {
                  id: "textCenter",
                  beforeDatasetsDraw(
                    chart: Chart<"doughnut", number[], unknown>,
                  ) {
                    const { ctx, data } = chart

                    ctx.save()
                    ctx.font = "bolder 25px --font-dm-sans"
                    ctx.fillStyle = `${
                      Percentage(
                        props.packages[findIndexByWarehouseId(warehouse.id)]
                          .totalVolume,
                        warehouse.volumeCapacityInCubicMeter,
                      ) < warehouse.targetUtilization
                        ? "rgb(255, 99, 132)"
                        : "rgb(241, 91, 86)"
                    }`
                    ctx.textAlign = "center"
                    ctx.textBaseline = "middle"
                    ctx.fillText(
                      `${data.datasets[0].data[0].toFixed(2)}%`,
                      chart.getDatasetMeta(0).data[0].x,
                      chart.getDatasetMeta(0).data[0].y,
                    )
                  },
                },
              ]}
            />
          </div>
        ))}
      </div>
    </article>
  )
}
