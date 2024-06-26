"use client"

import { Bar } from "react-chartjs-2"
import { unstable_noStore as noStore } from "next/cache"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js"
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement)

export function SurveyRatingsTile(props: {
  surveyRatings: number[]
  ratesLabel: string[]
}) {
  noStore()

  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[24rem] overflow-auto">
      <h2 className="font-semibold mb-2">Survey Ratings</h2>
      <div className="font-bold mb-4">Number of Responses</div>
      <Bar
        data={{
          labels: props.ratesLabel,
          datasets: [
            {
              data: props.surveyRatings,
              backgroundColor: ["#79CFDC"],
              borderColor: "rgb(75, 192, 192)",
            },
          ],
        }}
        options={{
          scales: {
            y: {
              min: 0,
              max: 5,
              ticks: {
                precision: 0,
              },
            },
          },
        }}
      />
    </article>
  )
}
