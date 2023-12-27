import { z } from "zod"
import { publicProcedure, router } from "../trpc"
import { packageRouter } from "./package"
import { userRouter } from "./user"
import { shipmentLocationRouter } from "./shipment-location"
import { packageStatusLogRouter } from "./package-status-logs"
import { incomingShipmentRouter } from "./incoming-shipment"
import { transferShipmentRouter } from "./transfer-shipment"
import { deliveryRouter } from "./delivery"
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
  delivery: deliveryRouter,
  shipmentLocation: shipmentLocationRouter,
  vehicle: vehicleRouter,
})

export type RootRouter = typeof rootRouter
