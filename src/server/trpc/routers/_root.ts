import { z } from "zod"
import { publicProcedure, router } from "../trpc"
import { packageRouter } from "./package"
import { userRouter } from "./user"
import { shipmentLocationRouter } from "./shipment-location"
import { packageStatusLogRouter } from "./package-status-logs"
import { incomingShipmentRouter } from "./incoming-shipment"
import { transferShipmentRouter } from "./transfer-shipment"
import { deliveryShipmentRouter } from "./delivery-shipment"
import { vehicleRouter } from "./vehicle"

export const rootRouter = router({
  hello: publicProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      }
    }),
  user: userRouter,
  package: packageRouter,
  packageStatusLog: packageStatusLogRouter,
  incomingShipment: incomingShipmentRouter,
  transferShipment: transferShipmentRouter,
  deliveryShipment: deliveryShipmentRouter,
  shipmentLocation: shipmentLocationRouter,
  vehicle: vehicleRouter,
})

export type RootRouter = typeof rootRouter
