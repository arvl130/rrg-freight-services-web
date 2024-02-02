import { getServerSession } from "@/server/auth"
import { db } from "@/server/db/client"
import { shipmentPackageOtps } from "@/server/db/schema"
import { and, eq, gt } from "drizzle-orm"
import { DateTime } from "luxon"
import { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"

const inputSchema = z.object({
  shipmentId: z.number(),
  packageId: z.string(),
  code: z.number(),
})

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession({ req, res })
  if (session === null) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  const { shipmentId, packageId, code } = inputSchema.parse({
    shipmentId: Number(req.query.id as string),
    packageId: req.query.packageId as string,
    code: Number(req.query.code as string),
  })

  const date = DateTime.now().setZone("Asia/Manila")
  if (!date.isValid) {
    res.status(500).json({ message: "Current date is invalid" })
    return
  }

  const results = await db
    .select()
    .from(shipmentPackageOtps)
    .where(
      and(
        eq(shipmentPackageOtps.shipmentId, shipmentId),
        eq(shipmentPackageOtps.packageId, packageId),
        eq(shipmentPackageOtps.code, code),
        eq(shipmentPackageOtps.isValid, 1),
        gt(shipmentPackageOtps.expireAt, date.toISO()),
      ),
    )

  if (results.length === 0) {
    res.status(404).json({ message: "Invalid or expired OTP" })
    return
  } else {
    res.json({ message: "OTP is valid" })
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession({ req, res })
  if (session === null) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  const { shipmentId, packageId, code } = inputSchema.parse({
    shipmentId: Number(req.query.id as string),
    packageId: req.query.packageId as string,
    code: Number(req.query.code as string),
  })

  const date = DateTime.now().setZone("Asia/Manila")
  if (!date.isValid) {
    res.status(500).json({ message: "Current date is invalid" })
    return
  }

  const results = await db
    .select()
    .from(shipmentPackageOtps)
    .where(
      and(
        eq(shipmentPackageOtps.shipmentId, shipmentId),
        eq(shipmentPackageOtps.packageId, packageId),
        eq(shipmentPackageOtps.code, code),
        eq(shipmentPackageOtps.isValid, 1),
        gt(shipmentPackageOtps.expireAt, date.toISO()),
      ),
    )

  if (results.length === 0) {
    res.status(404).json({ message: "Invalid or expired OTP" })
    return
  } else {
    await db
      .update(shipmentPackageOtps)
      .set({
        isValid: 0,
      })
      .where(
        and(
          eq(shipmentPackageOtps.shipmentId, shipmentId),
          eq(shipmentPackageOtps.packageId, packageId),
          eq(shipmentPackageOtps.code, code),
          eq(shipmentPackageOtps.isValid, 1),
          gt(shipmentPackageOtps.expireAt, date.toISO()),
        ),
      )

    res.json({ message: "OTP invalidated" })
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    await handleGet(req, res)
    return
  }

  if (req.method === "POST") {
    await handlePost(req, res)
    return
  }

  res.status(405).json({
    message: "Unsupported method",
  })
}
