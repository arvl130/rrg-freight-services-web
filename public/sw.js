self.addEventListener("push", async (event) => {
  if (event.data) {
    const eventData = await event.data.json()

    self.registration.showNotification(eventData.title, {
      body: eventData.body,
      icon: "/icons/icon-192.png",
    })
  }
})
