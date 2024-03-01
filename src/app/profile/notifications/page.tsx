"use client"

import { ToggleLeft } from "@phosphor-icons/react/dist/ssr/ToggleLeft"
import { ToggleRight } from "@phosphor-icons/react/dist/ssr/ToggleRight"
import { GenericLayout } from "@/components/generic-layout"
import { SideNav } from "../sidenav"
import { api } from "@/utils/api"
import usePermission from "@custom-react-hooks/use-permission"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getPushSubscription,
  getServiceWorkerRegistration,
  subscribeToPushNotifications,
  unsubscribeToPushNotifications,
} from "@/utils/service-workers"

function ToggleButtons(props: {
  serviceWorkerRegistration: ServiceWorkerRegistration
}) {
  const queryClient = useQueryClient()
  const {
    status,
    data: pushSubscription,
    error,
  } = useQuery({
    queryKey: ["getPushSubscription"],
    queryFn: () => getPushSubscription(props.serviceWorkerRegistration),
  })

  const subscribeMutation = useMutation({
    mutationKey: ["subscribeToPushNotifications"],
    mutationFn: subscribeToPushNotifications,
    onSuccess: (data) => {
      createPushSubscriptionMutation.mutate(
        {
          endpoint: data.endpoint,
          expirationTime: data.expirationTime,
          keys: {
            auth: data.toJSON().keys?.auth!,
            p256dh: data.toJSON().keys?.p256dh!,
          },
        },
        {
          onSettled: () =>
            queryClient.setQueryData(["getPushSubscription"], data),
        },
      )
    },
  })

  const createPushSubscriptionMutation =
    api.pushSubscriptions.create.useMutation()

  const unsubscribeMutation = useMutation({
    mutationKey: ["unsubscribeToPushNotifications"],
    mutationFn: unsubscribeToPushNotifications,
    onSuccess: (_, variables) => {
      deletePushSubscriptionMutation.mutate(
        {
          endpoint: variables.endpoint,
        },
        {
          onSettled: () =>
            queryClient.setQueryData(["getPushSubscription"], null),
        },
      )
    },
  })

  const deletePushSubscriptionMutation =
    api.pushSubscriptions.delete.useMutation()

  const isButtonDisabled =
    subscribeMutation.isLoading ||
    createPushSubscriptionMutation.isLoading ||
    unsubscribeMutation.isLoading ||
    deletePushSubscriptionMutation.isLoading

  if (status === "loading") return <>...</>
  if (status === "error") return <>error</>
  if (pushSubscription === null)
    return (
      <button
        type="button"
        className="text-gray-700 disabled:text-gray-300 transition-colors duration-200"
        disabled={isButtonDisabled}
        onClick={() =>
          subscribeMutation.mutate(props.serviceWorkerRegistration)
        }
      >
        <ToggleLeft size={32} />
      </button>
    )

  return (
    <div className="flex gap-3">
      <TestNotificationsButton isMutating={isButtonDisabled} />

      <button
        type="button"
        className="text-gray-700 disabled:text-gray-300 transition-colors duration-200"
        disabled={isButtonDisabled}
        onClick={() => unsubscribeMutation.mutate(pushSubscription)}
      >
        <ToggleRight size={32} weight="fill" />
      </button>
    </div>
  )
}

function TogglePushNotifications() {
  const { status, data, error } = useQuery({
    queryKey: ["getServiceWorkerRegistration"],
    queryFn: getServiceWorkerRegistration,
  })

  return (
    <div className="flex items-center justify-between">
      <h2 className="font-semibold">Show Notification</h2>
      {status === "loading" && <>...</>}
      {status === "error" && <>error</>}
      {status === "success" && (
        <ToggleButtons serviceWorkerRegistration={data} />
      )}
    </div>
  )
}

function TestNotificationsButton(props: { isMutating: boolean }) {
  const { isLoading, mutate } = api.pushSubscriptions.testPublish.useMutation()

  return (
    <button
      type="button"
      disabled={props.isMutating || isLoading}
      onClick={() => mutate()}
      className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-300 text-white transition-colors font-medium px-3 py-1 rounded-md"
    >
      Test
    </button>
  )
}

function RightColumn() {
  const permission = usePermission("notifications")

  return (
    <article>
      <div className="px-6 py-3  rounded-lg bg-white">
        {permission.isLoading ? (
          <>Loading ...</>
        ) : (
          <>
            {permission.state === "prompt" && (
              <>
                <p className="mb-3 text-sm">
                  To get notified on updates to shipments and packages, please
                  enable browser notifications.
                </p>
                <div className="flex justify-between">
                  <h2 className="font-semibold">Show Notification</h2>
                  <button
                    type="button"
                    className="bg-gray-700 hover:bg-gray-600 transition-colors duration-200 text-white px-4 py-2 rounded-md"
                    onClick={() => {
                      Notification.requestPermission()
                    }}
                  >
                    Request Permission
                  </button>
                </div>
              </>
            )}
            {permission.state === "granted" && <TogglePushNotifications />}
            {permission.state === "denied" && (
              <>
                <p className="mb-3 text-sm">
                  Updates on shipments and packages cannot be sent without
                  permission to send browser notifications. To get notified,
                  please allow notifications.
                </p>
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Show Notification</h2>
                  <ToggleLeft size={32} className="text-gray-300" />
                </div>
              </>
            )}
          </>
        )}
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
