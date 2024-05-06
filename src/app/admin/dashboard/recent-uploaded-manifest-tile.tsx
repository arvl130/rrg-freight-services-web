import { db } from "@/server/db/client"

import { and, count, desc, eq, lt, ne, or, asc, max } from "drizzle-orm"

import { uploadedManifests, users } from "@/server/db/schema"
import { DateTime } from "luxon"

export async function RecentUploadedManifestTile() {
  const uploadedManifest = await db
    .select()
    .from(uploadedManifests)
    .orderBy(desc(uploadedManifests.createdAt))
    .limit(6)
    .innerJoin(users, eq(users.id, uploadedManifests.userId))

  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[24rem] overflow-auto">
      <h2 className="font-semibold mb-2">Recent Uploaded Manifest By Agent</h2>
      <table className="table-fixed w-full text-sm border-separate border-spacing-y-1	">
        <thead>
          <tr className="text-left">
            <th className="text-black font-bold">Agent Name</th>
            <th className="text-black font-bold">Uploaded At</th>
            <th className="text-black font-bold">Shipment ID</th>
            <th className="text-black font-bold text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {uploadedManifest?.length === 0 && (
            <tr>
              <td className="col-span-4">No Uploaded Manifest</td>
            </tr>
          )}
          {uploadedManifest?.map((manifest) => (
            <tr key={manifest.uploaded_manifests.id}>
              <td>{manifest.users.displayName}</td>
              <td>
                {DateTime.fromISO(
                  manifest.uploaded_manifests.createdAt,
                ).toLocaleString(DateTime.DATE_MED)}
              </td>
              <td>{manifest.uploaded_manifests.shipmentId}</td>
              <td
                className={`text-center text-white rounded-lg py-1 px-3 font-bold ${
                  manifest.uploaded_manifests.status === "SHIPMENT_CREATED"
                    ? "bg-[#3DE074]"
                    : manifest.uploaded_manifests.status === "PENDING_REVIEW"
                      ? "bg-[#F17834]"
                      : "bg-rose-600"
                }`}
              >
                {manifest.uploaded_manifests.status.replace("_", " ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  )
}
function noStore() {
  throw new Error("Function not implemented.")
}
