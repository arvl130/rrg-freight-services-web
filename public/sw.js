async function getCurrentSessionAndUser() {
  const response = await fetch("/api/v1/user/with-cookies", {
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (response.status === 401) return null

  const responseJson = await response.json()
  if (!response.ok) {
    throw new Error("Response not OK.")
  }

  return responseJson
}

self.addEventListener("push", async (event) => {
  if (!event.data) return
  try {
    const sessionAndUser = await getCurrentSessionAndUser()
    if (!sessionAndUser) return

    const eventData = await event.data.json()
    if (sessionAndUser.user.id !== eventData.userId) return

    self.registration.showNotification(eventData.title, {
      body: eventData.body,
      icon: "/icons/icon-192.png",
    })
  } catch (e) {
    console.log("An error occured while trying to display notification:", e)
  }
})
