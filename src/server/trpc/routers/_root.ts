import { z } from "zod"
import { publicProcedure, router } from "../trpc"
import { packageRouter } from "./package"
import { userRouter } from "./user"
import { shipmentRouter } from "./shipment"

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
  shipment: shipmentRouter,
})

export type RootRouter = typeof rootRouter
