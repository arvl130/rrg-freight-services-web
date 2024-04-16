"use client"
import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/server/db/client"
import { Bar, Doughnut, Line } from "react-chartjs-2"
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

export function ShipmentPerMonthTile(props: {
  shipmentPerMonth: number[]
  monthsLabel: string[]
}) {
  noStore()

  const date = new Date()
  let month = date.getMonth()
  const data = {
    labels: props.monthsLabel.slice(0, month + 1),
    datasets: [
      {
        labels: "Package of Month",
        data: props.shipmentPerMonth,
        tension: 0.5,

        pointBorderColor: "rgb(75, 192, 192)",
        fill: true,
        borderColor: ["#79CFDC"],
      },
    ],
  }

  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[24rem] overflow-auto ">
      <h2 className="font-semibold mb-2">Shipment per month</h2>
      <Line data={data} />
    </article>
  )
}
