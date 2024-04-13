import { initTRPC, TRPCError } from "@trpc/server"
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"
import { validateSessionWithCookies } from "../auth"
import { db } from "../db/client"
import SuperJSON from "superjson"

export async function createContext({ req }: FetchCreateContextFnOptions) {
  const { user } = await validateSessionWithCookies()

  return {
    user,
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

const hasAdminUser = t.middleware(({ ctx: { user }, next }) => {
  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    })
  }

  if (user.role !== "ADMIN") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    })
  }

  return next({
    ctx: {
      user: {
        ...user,
        role: user.role,
      },
    },
  })
})

const hasWarehouseStaffUser = t.middleware(({ ctx: { user }, next }) => {
  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    })
  }

  if (user.role !== "WAREHOUSE") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    })
  }

  return next({
    ctx: {
      user: {
        ...user,
        role: user.role,
      },
    },
  })
})

const hasDriverUser = t.middleware(({ ctx: { user }, next }) => {
  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    })
  }

  if (user.role !== "DRIVER") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    })
  }

  return next({
    ctx: {
      user: {
        ...user,
        role: user.role,
      },
    },
  })
})

const hasOverseasAgentUser = t.middleware(({ ctx: { user }, next }) => {
  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    })
  }

  if (user.role !== "OVERSEAS_AGENT") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    })
  }

  return next({
    ctx: {
      user: {
        ...user,
        role: user.role,
      },
    },
  })
})

const hasDomesticAgentUser = t.middleware(({ ctx: { user }, next }) => {
  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    })
  }

  if (user.role !== "DOMESTIC_AGENT") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    })
  }

  return next({
    ctx: {
      user: {
        ...user,
        role: user.role,
      },
    },
  })
})

export const protectedProcedure = t.procedure.use(hasUser)
export const adminProcedure = t.procedure.use(hasAdminUser)
export const warehouseStaffProcedure = t.procedure.use(hasWarehouseStaffUser)
export const driverProcedure = t.procedure.use(hasDriverUser)
export const overseasAgentProcedure = t.procedure.use(hasOverseasAgentUser)
export const domesticAgentProcedure = t.procedure.use(hasDomesticAgentUser)
