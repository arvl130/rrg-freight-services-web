"use client"

import { api } from "@/utils/api"
import { Bar } from "react-chartjs-2"

export function DeliverySummaryTile() {
  const labels = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ]

  const { data } = api.packageStatusLog.getDeliverySummary.useQuery()

  const deliverySummaryCount =
    data && data.deliverySummaryCount ? data.deliverySummaryCount : []

  const countByMonth = deliverySummaryCount.reduce((total, item) => {
    const month = parseInt(String(item.month), 10) - 1
    total[month] = item.value
    return total
  }, Array(12).fill(0))

  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[24rem]">
      <h2 className="font-semibold mb-2">Delivery Summary</h2>
      <Bar
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
            },
          },
          scales: {
            y: {
              suggestedMax: Math.max(...countByMonth) + 100,
              ticks: {
                stepSize: 10,
              },
            },
          },
        }}
        data={{
          labels,
          datasets: [
            {
              label: "Packages",
              data: countByMonth,
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
        }}
      />
    </article>
  )
}
