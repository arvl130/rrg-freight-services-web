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
import { stringToSha256Hash } from "@/utils/hash"

function ToggleButtons(props: {
  serviceWorkerRegistration: ServiceWorkerRegistration
}) {
  const utils = api.useUtils()
  const userWebPushSubscriptionsQuery =
    api.user.getWebPushSubscriptions.useQuery()

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
          onSuccess: () => {
            utils.user.getWebPushSubscriptions.invalidate()
          },
          onSettled: () => {
            queryClient.setQueryData(["getPushSubscription"], data)
          },
        },
      )
    },
  })

  const createPushSubscriptionMutation =
    api.webpushSubscription.create.useMutation()

  const unsubscribeMutation = useMutation({
    mutationKey: ["unsubscribeToPushNotifications"],
    mutationFn: unsubscribeToPushNotifications,
    onSuccess: (_, variables) => {
      deletePushSubscriptionMutation.mutate(
        {
          endpoint: variables.endpoint,
        },
        {
          onSuccess: () => {
            utils.user.getWebPushSubscriptions.invalidate()
          },
          onSettled: () =>
            queryClient.setQueryData(["getPushSubscription"], undefined),
        },
      )
    },
  })

  const deletePushSubscriptionMutation =
    api.webpushSubscription.delete.useMutation()

  const isButtonDisabled =
    subscribeMutation.isPending ||
    createPushSubscriptionMutation.isPending ||
    unsubscribeMutation.isPending ||
    deletePushSubscriptionMutation.isPending

  if (userWebPushSubscriptionsQuery.status === "pending") return <>...</>
  if (userWebPushSubscriptionsQuery.status === "error") return <>error</>
  if (status === "pending") return <>...</>
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

  const isRegistered = userWebPushSubscriptionsQuery.data.some(
    (webpushSubscription) =>
      webpushSubscription.endpointHashed ===
      stringToSha256Hash(pushSubscription.endpoint),
  )

  if (isRegistered) {
    return (
      <div className="flex gap-3">
        <TestNotificationsButton
          endpoint={pushSubscription.endpoint}
          isMutating={isButtonDisabled}
        />

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
  } else {
    return (
      <button
        type="button"
        className="text-gray-700 disabled:text-gray-300 transition-colors duration-200"
        disabled={isButtonDisabled}
        onClick={() =>
          createPushSubscriptionMutation.mutate(
            {
              endpoint: pushSubscription.endpoint,
              expirationTime: pushSubscription.expirationTime,
              keys: {
                auth: pushSubscription.toJSON().keys?.auth!,
                p256dh: pushSubscription.toJSON().keys?.p256dh!,
              },
            },
            {
              onSuccess: () => {
                utils.user.getWebPushSubscriptions.invalidate()
              },
            },
          )
        }
      >
        <ToggleLeft size={32} />
      </button>
    )
  }
}

function TogglePushNotifications() {
  const { status, data, error } = useQuery({
    queryKey: ["getServiceWorkerRegistration"],
    queryFn: getServiceWorkerRegistration,
  })

  return (
    <div className="flex items-center justify-between">
      <h2 className="font-semibold">Show Notification</h2>
      {status === "pending" && <>...</>}
      {status === "error" && <>error</>}
      {status === "success" && (
        <ToggleButtons serviceWorkerRegistration={data} />
      )}
    </div>
  )
}

function TestNotificationsButton(props: {
  endpoint: string
  isMutating: boolean
}) {
  const { isPending, mutate } =
    api.webpushSubscription.testPublish.useMutation()

  return (
    <button
      type="button"
      disabled={props.isMutating || isPending}
      onClick={() =>
        mutate({
          endpoint: props.endpoint,
        })
      }
      className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-300 text-white transition-colors font-medium px-3 py-1 rounded-md"
    >
      Test
    </button>
  )
}

export function RightColumn() {
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
