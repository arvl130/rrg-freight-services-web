import type { UserRole } from "./constants"

const adminPages = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    title: "Packages",
    path: "/admin/packages",
  },
  {
    title: "Incoming Shipments",
    path: "/admin/shipments/incoming",
  },
  {
    title: "Delivery Shipments",
    path: "/admin/shipments/delivery",
  },
  {
    title: "Forwarder Transfer Shipments",
    path: "/admin/shipments/transfer/forwarder",
  },
  {
    title: "Warehouse Transfer Shipments",
    path: "/admin/shipments/transfer/warehouse",
  },
  {
    title: "Vehicles",
    path: "/admin/vehicles",
  },
  {
    title: "Activity Logs",
    path: "/admin/logs",
  },
  {
    title: "Users",
    path: "/admin/users",
  },
  {
    title: "Profile",
    path: "/profile/settings",
  },
]

const warehousePages = [
  {
    title: "Dashboard",
    path: "/warehouse/dashboard",
  },
  {
    title: "Packages",
    path: "/warehouse/packages",
  },
  {
    title: "Scan Package",
    path: "/warehouse/packages/scan",
  },
  {
    title: "Profile",
    path: "/profile/settings",
  },
]

const overseasPages = [
  {
    title: "Dashboard",
    path: "/overseas/dashboard",
  },
  {
    title: "Packages",
    path: "/overseas/packages",
  },
  {
    title: "Profile",
    path: "/profile/settings",
  },
]

const domesticPages = [
  {
    title: "Dashboard",
    path: "/domestic/dashboard",
  },
  {
    title: "Packages",
    path: "/domestic/packages",
  },
  {
    title: "Transfer Forwarder Shipments",
    path: "/domestic/transfer-forwarder-shipments",
  },
  {
    title: "Profile",
    path: "/profile/settings",
  },
]

const driverPages = [
  {
    title: "Dashboard",
    path: "/driver/dashboard",
  },
  {
    title: "Profile",
    path: "/profile/settings",
  },
]

export function getSearchablePagesForRole(role: UserRole | null) {
  if (role === "ADMIN") return adminPages
  if (role === "WAREHOUSE") return warehousePages
  if (role === "OVERSEAS_AGENT") return overseasPages
  if (role === "DOMESTIC_AGENT") return domesticPages
  if (role === "DRIVER") return driverPages

  return []
}
