import { z } from "zod"
import { publicProcedure, router } from "../trpc"
import { packageRouter } from "./package"
import { userRouter } from "./user"
import { packageStatusLogRouter } from "./package-status-logs"
import { vehicleRouter } from "./vehicle"
import { warehouseRouter } from "./warehouse"
import { shipmentRouter } from "./shipment/shipment"
import { packageCategoriesRouter } from "./package-categories"
import { pushSubscriptionsRouter } from "./push-subscriptions"
import { activityRouter } from "./activity"
import { webauthnRouter } from "./webauthn"

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
  shipment: shipmentRouter,
  vehicle: vehicleRouter,
  warehouse: warehouseRouter,
  packageCategories: packageCategoriesRouter,
  pushSubscriptions: pushSubscriptionsRouter,
  activity: activityRouter,
  webauthn: webauthnRouter,
})

export type RootRouter = typeof rootRouter
