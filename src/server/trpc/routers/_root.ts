import { z } from "zod"
import { publicProcedure, router } from "../trpc"
import { packageRouter } from "./package"
import { userRouter } from "./user"
import { deliveryLocationRouter } from "./delivery-location"
import { packageStatusLogRouter } from "./package-status-logs"

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
  deliveryLocation: deliveryLocationRouter,
})

export type RootRouter = typeof rootRouter
