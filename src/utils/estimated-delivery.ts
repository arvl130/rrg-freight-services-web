import { DateTime } from "luxon"
import type { Package } from "@/server/db/entities"

export function getEstimatedDeliveryOfPackage(_package: Package) {
  if (_package.status === "INCOMING") return "N/A"
  if (!_package.isDeliverable) return "N/A"
  if (_package.status === "DELIVERED") return "N/A"

  if (
    _package.status === "IN_WAREHOUSE" ||
    _package.status === "PREPARING_FOR_TRANSFER"
  ) {
    if (_package.expectedHasDeliveryAt === null) return "N/A"

    const expectedHasDeliveryAt = DateTime.fromISO(
      _package.expectedHasDeliveryAt,
    )
    if (!expectedHasDeliveryAt.isValid) return "Invalid Date"

    const expectedHasDeliveryAtPlusTwoDays = expectedHasDeliveryAt.plus({
      days: 2,
    })

    const expectedHasDeliveryAtPlusFourDays = expectedHasDeliveryAt.plus({
      days: 4,
    })

    return `${expectedHasDeliveryAtPlusTwoDays.toLocaleString(
      DateTime.DATE_FULL,
    )} - ${expectedHasDeliveryAtPlusFourDays.toLocaleString(
      DateTime.DATE_FULL,
    )}`
  }

  if (_package.status === "TRANSFERRING_WAREHOUSE") return "N/A"

  if (_package.status === "OUT_FOR_DELIVERY") {
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
