import { and, eq, isNull, lt, sql } from "drizzle-orm"
import { protectedProcedure, router } from "../trpc"
import { shipmentStatusLogs } from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { alias } from "drizzle-orm/mysql-core"

export const shipmentStatusLogRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(shipmentStatusLogs)
  }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select()
        .from(shipmentStatusLogs)
        .where(eq(shipmentStatusLogs.id, input.id))

      if (results.length === 0)
        throw new TRPCError({
          code: "NOT_FOUND",
        })

      if (results.length > 1)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Expected 1 result, but got multiple.",
        })

      return results[0]
    }),
  getLatest: protectedProcedure.query(async ({ ctx }) => {
    // Obtain the latest status using the group-wise maximum of a column.
    //
    // SQL equivalent:
    //  SELECT
    //    ssl1.*
    //  FROM shipment_status_logs ssl1
    //  LEFT JOIN shipment_status_logs ssl2
    //  ON ssl1.shipment_id = ssl2.shipment_id
    //  AND ssl1.created_at < ssl2.created_at
    //  WHERE ssl2.id IS NULL
    //
    // Source: https://dev.mysql.com/doc/refman/8.0/en/example-maximum-column-group-row.html

    const ssl1 = alias(shipmentStatusLogs, "ssl1")
    const ssl2 = alias(shipmentStatusLogs, "ssl2")

    return await ctx.db
      .select()
      .from(ssl1)
      .leftJoin(
        ssl2,
        and(
          eq(ssl1.shipmentId, ssl2.shipmentId),
          lt(ssl1.createdAt, ssl2.createdAt),
        ),
      )
      .where(isNull(ssl2.id))
  }),
  getLatestByShipmentId: protectedProcedure
    .input(
      z.object({
        shipmentId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Obtain the latest status of a shipment id using the group-wise maximum of a column.
      //
      // SQL equivalent:
      //  SELECT
      //    ssl1.*
      //  FROM shipment_status_logs ssl1
      //  LEFT JOIN shipment_status_logs ssl2
      //  ON ssl1.shipment_id = ssl2.shipment_id
      //  AND ssl1.created_at < ssl2.created_at
      //  WHERE ssl2.id IS NULL
      //  AND ssl1.shipment_id = ?
      //
      // Source: https://dev.mysql.com/doc/refman/8.0/en/example-maximum-column-group-row.html

      const ssl1 = alias(shipmentStatusLogs, "ssl1")
      const ssl2 = alias(shipmentStatusLogs, "ssl2")
      const results = await ctx.db
        .select()
        .from(ssl1)
        .leftJoin(
          ssl2,
          and(
            eq(ssl1.shipmentId, ssl2.shipmentId),
            lt(ssl1.createdAt, ssl2.createdAt),
          ),
        )
        .where(and(isNull(ssl2.id), eq(ssl1.shipmentId, input.shipmentId)))

      if (results.length === 0)
        throw new TRPCError({
          code: "NOT_FOUND",
        })

      if (results.length > 1)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Expected 1 result, but got multiple.",
        })

      return results[0]
    }),
})
