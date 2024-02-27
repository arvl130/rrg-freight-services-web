"use client"

import { ToggleLeft } from "@phosphor-icons/react/dist/ssr/ToggleLeft"
import { GenericLayout } from "@/components/generic-layout"
import { SideNav } from "../sidenav"
import { api } from "@/utils/api"
import { clientEnv } from "@/utils/env.mjs"
import { unregisterServiceWorkers } from "@/utils/service-workers"
import { useState } from "react"

function RightColumn() {
  const [isLoading, setIsLoading] = useState(false)
  const { status, mutate } = api.pushSubscriptions.create.useMutation()
  const testPublishMutation = api.pushSubscriptions.testPublish.useMutation()

  return (
    <article>
      <div className="px-6 py-3 flex items-center justify-between rounded-lg bg-white">
        <h2 className="font-semibold">Show Notification</h2>
        <button
          type="button"
          disabled={testPublishMutation.status === "loading"}
          onClick={() => {
            testPublishMutation.mutate()
          }}
        >
          Test
        </button>

        <button
          type="button"
          disabled={isLoading || status === "loading"}
          className="disabled:text-gray-300 transition-colors"
          onClick={async () => {
            setIsLoading(true)
            try {
              await Notification.requestPermission()
              await unregisterServiceWorkers()

              const swRegistration =
                await navigator.serviceWorker.register("/sw.js")
              const subscription = await swRegistration.pushManager.subscribe({
                applicationServerKey: clientEnv.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
                userVisibleOnly: true,
              })

              mutate({
                endpoint: subscription.endpoint,
                expirationTime: subscription.expirationTime,
                keys: {
                  auth: subscription.toJSON().keys?.auth!,
                  p256dh: subscription.toJSON().keys?.p256dh!,
                },
              })
            } catch (err) {
              console.error("Unknown error:", err)
            } finally {
              setIsLoading(false)
            }
          }}
        >
          <ToggleLeft size={32} />
        </button>
      </div>
    </article>
  )
}

export default function ProfileNotificationsPage() {
  return (
    <GenericLayout title={["Profile", "Notifications"]}>
      <main className="pt-2 pb-6">
        <section className="grid  sm:grid-cols-[22rem_1fr] gap-6 max-w-4xl mx-auto">
          <SideNav />
          <RightColumn />
        </section>
      </main>
    </GenericLayout>
  )
}
