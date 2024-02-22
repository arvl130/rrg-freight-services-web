import { initTRPC, TRPCError } from "@trpc/server"
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"
import { getServerSessionFromFetchRequest } from "../auth"
import { db } from "../db/client"
import SuperJSON from "superjson"

export async function createContext({ req }: FetchCreateContextFnOptions) {
  const session = await getServerSessionFromFetchRequest({ req })

  return {
    user: session?.user,
    db,
  }
}

const t = initTRPC.context<typeof createContext>().create({
  transformer: SuperJSON,
  errorFormatter({ shape }) {
    return shape
  },
})

export const router = t.router
export const publicProcedure = t.procedure

const hasUser = t.middleware(({ ctx: { user }, next }) => {
  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    })
  }

  return next({
    ctx: {
      user,
    },
  })
})

export const protectedProcedure = t.procedure.use(hasUser)
