import { z } from "zod"
import { publicProcedure, router } from "../trpc"
import { packageRouter } from "./package"

export const rootRouter = router({
  hello: publicProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      }
    }),
  package: packageRouter,
})

export type RootRouter = typeof rootRouter
