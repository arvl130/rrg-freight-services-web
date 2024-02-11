"use client"

import { Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js"
import { api } from "@/utils/api"

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement)

export function UserStatusTile() {
  const { data } = api.user.getTotalUserStatus.useQuery()

  const activeUsersCount = data ? data.activeUsersCount[0]?.active ?? 0 : 0
  const inactiveUsersCount = data
    ? data.inactiveUsersCount[0]?.inactive ?? 0
    : 0

  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[20rem]">
      <h2 className="font-semibold mb-2">User Status</h2>
      <Pie
        options={{
          plugins: {
            legend: {
              position: "bottom",
            },
          },
        }}
        data={{
          labels: ["Active", "Inactive"],
          datasets: [
            {
              label: "# of Users",
              data: [activeUsersCount, inactiveUsersCount],
              backgroundColor: [
                "rgba(112, 48, 160, 1.0)",
                "rgba(192, 0, 0, 1.0)",
              ],
            },
          ],
        }}
      />
    </article>
  )
}
