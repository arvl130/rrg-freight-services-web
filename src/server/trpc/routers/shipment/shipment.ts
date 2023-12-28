import { router } from "../../trpc"
import { deliveryShipmentRouter } from "./delivery"
import { incomingShipmentRouter } from "./incoming"
import { shipmentLocationRouter } from "./location"
import { forwarderTransferShipmentRouter } from "./forwarder-transfer"

export const shipmentRouter = router({
  delivery: deliveryShipmentRouter,
  incoming: incomingShipmentRouter,
  forwarderTransfer: forwarderTransferShipmentRouter,
  location: shipmentLocationRouter,
})
