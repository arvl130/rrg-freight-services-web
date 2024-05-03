"use client"
import { Bar } from "react-chartjs-2"
import { unstable_noStore as noStore } from "next/cache"
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  plugins,
} from "chart.js"

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement)

export function SurveyRatings(props: {
  packagesPerMonth: number[]
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
        data: props.packagesPerMonth,
        tension: 0.5,

        pointBorderColor: "rgb(75, 192, 192)",
        fill: true,
        backgroundColor: ["#79CFDC"],
      },
    ],
  }
  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[24rem] overflow-auto ">
      <h2 className="font-semibold mb-2">Survey Ratings</h2>
      <Bar data={data} />
    </article>
  )
}
