import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight"
import React from "react"
import type { User, Activity } from "@/server/db/entities"
import { DateTime } from "luxon"
import { getColorFromActivityVerb } from "@/utils/colors"
import { activities } from "@/server/db/schema"
import Link from "next/link"

type Logs = {
  users: User
  activities: Activity
}[]

export function LogsTile(props: { logs: Logs }) {
  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[20rem]">
      <div className="mb-2">
        <div className="flex justify-between">
          <h2 className="font-semibold">Current Logs</h2>
        </div>
      </div>
      <table className="table-fixed w-full text-sm border-separate border-spacing-y-1	">
        <thead>
          <tr>
            <td className="text-black font-bold">Name</td>
            <td className="text-black font-bold">Date & Time</td>
            <td className="text-black font-bold flex justify-center	">
              Activity
            </td>
          </tr>
        </thead>
        <tbody>
          {props.logs.length === 0 ? (
            <tr>
              <td className="col-span-3">No activity found.</td>
            </tr>
          ) : (
            <>
              {props.logs.map((activity) => (
                <tr key={activity.activities.id}>
                  <td>{activity.users.displayName}</td>
                  <td>
                    <div>
                      {DateTime.fromISO(
                        activity.activities.createdAt,
                      ).toLocaleString(DateTime.DATE_MED)}
                    </div>
                    <div>
                      {DateTime.fromISO(
                        activity.activities.createdAt,
                      ).toLocaleString(DateTime.TIME_SIMPLE)}
                    </div>
                  </td>
                  <td className="flex justify-center">
                    {" "}
                    <span
                      className={`${getColorFromActivityVerb(
                        activity.activities.verb,
                      )} text-white px-3 py-1.5 inline-block rounded-md font-semibold`}
                    >
                      {activity.activities.verb}
                    </span>
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
