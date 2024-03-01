import { clientEnv } from "./env.mjs"

export function isNotificationsSupported() {
  return (
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  )
}

export async function getServiceWorkerRegistration() {
  return await navigator.serviceWorker.register("/sw.js")
}

export async function getPushSubscription(
  swRegistration: ServiceWorkerRegistration,
) {
  return await swRegistration.pushManager.getSubscription()
}

export async function subscribeToPushNotifications(
  swRegistration: ServiceWorkerRegistration,
) {
  return await swRegistration.pushManager.subscribe({
    applicationServerKey: clientEnv.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
    userVisibleOnly: true,
  })
}

export async function unsubscribeToPushNotifications(
  pushSubscription: PushSubscription,
) {
  return await pushSubscription.unsubscribe()
}
