export function isNotificationsSupported() {
  return (
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  )
}

export async function unregisterServiceWorkers() {
  const registrations = await navigator.serviceWorker.getRegistrations()
  await Promise.all(registrations.map((r) => r.unregister()))
}
