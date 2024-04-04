import { DateTime } from "luxon"
import { DELIVERABLE_PROVINCES_IN_PH } from "./region-code"
import type { Package } from "@/server/db/entities"

export function getEstimatedDeliveryOfPackage(_package: Package) {
  if (_package.status === "INCOMING") return "N/A"

  const hasDeliverableDestination = DELIVERABLE_PROVINCES_IN_PH.includes(
    _package.receiverStateOrProvince.trim().toUpperCase(),
  )

  if (!hasDeliverableDestination) return "N/A"
  if (_package.status === "DELIVERED") return "N/A"

  if (_package.status === "IN_WAREHOUSE" || _package.status === "SORTING") {
    if (_package.expectedHasDeliveryAt === null) return "N/A"

    const expectedHasDeliveryAt = DateTime.fromISO(
      _package.expectedHasDeliveryAt,
    )
    if (!expectedHasDeliveryAt.isValid) return "Invalid Date"

    const expectedHasDeliveryAtPlusTwoDays = expectedHasDeliveryAt.plus({
      days: 2,
    })

    const expectedHasDeliveryAtPlusThreeDays = expectedHasDeliveryAt.plus({
      days: 3,
    })

    return `${expectedHasDeliveryAtPlusTwoDays.toLocaleString(
      DateTime.DATE_FULL,
    )} - ${expectedHasDeliveryAtPlusThreeDays.toLocaleString(
      DateTime.DATE_FULL,
    )}`
  }

  if (_package.status === "TRANSFERRING_WAREHOUSE") return "N/A"

  if (_package.status === "DELIVERING") {
    if (_package.expectedIsDeliveredAt === null) return "N/A"

    const expectedIsDeliveredAt = DateTime.fromISO(
      _package.expectedIsDeliveredAt,
    )
    if (!expectedIsDeliveredAt.isValid) return "Invalid Date"

    const expectedIsDeliveredAtMinusOneDay = expectedIsDeliveredAt.minus({
      day: 1,
    })

    return `${expectedIsDeliveredAtMinusOneDay.toLocaleString(
      DateTime.DATE_FULL,
    )} - ${expectedIsDeliveredAt.toLocaleString(DateTime.DATE_FULL)}`
  }

  return "N/A"
}