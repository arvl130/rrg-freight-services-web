import { router } from "../../trpc"
import { deliveryShipmentRouter } from "./delivery"
import { incomingShipmentRouter } from "./incoming"
import { shipmentLocationRouter } from "./location"
import { forwarderTransferShipmentRouter } from "./forwarder-transfer"
import { warehouseTransferShipmentRouter } from "./warehouse-transfer"

export const shipmentRouter = router({
  delivery: deliveryShipmentRouter,
  incoming: incomingShipmentRouter,
  forwarderTransfer: forwarderTransferShipmentRouter,
  warehouseTransfer: warehouseTransferShipmentRouter,
  location: shipmentLocationRouter,
})
