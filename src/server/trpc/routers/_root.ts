import { z } from "zod"
import { publicProcedure, router } from "../trpc"

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
})

export type RootRouter = typeof rootRouter
