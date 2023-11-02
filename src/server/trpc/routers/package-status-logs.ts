import { and, eq, sql } from "drizzle-orm"
import { protectedProcedure, router } from "../trpc"
import { packageStatusLogs } from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { alias } from "drizzle-orm/mysql-core"

export const packageStatusLogRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(packageStatusLogs)
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
        .from(packageStatusLogs)
        .where(eq(packageStatusLogs.id, input.id))

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
  getLatestOrderedByPackageId: protectedProcedure.query(async ({ ctx }) => {
    // Obtain the latest status using the group-wise maximum of a column.
    //
    // SQL equivalent:
    //   SELECT * FROM
    //     package_status_logs psl1
    //   WHERE psl1.created_at =
    //     (
    //       SELECT MAX(psl2.created_at)
    //       FROM package_status_logs psl2
    //       WHERE psl1.package_id = psl2.package_id
    //     )
    //   ORDER BY psl1.package_id;
    //
    // Source: https://dev.mysql.com/doc/refman/8.0/en/example-maximum-column-group-row.html

    const psl1 = alias(packageStatusLogs, "psl1")
    const psl2 = alias(packageStatusLogs, "psl2")

    const subQuery = ctx.db
      .select({
        maxCreatedAt: sql`max(${psl2.createdAt})`,
      })
      .from(psl2)
      .where(eq(psl1.packageId, psl2.packageId))

    const mainQuery = ctx.db
      .select()
      .from(psl1)
      .where(eq(psl1.createdAt, subQuery))
      .orderBy(psl1.packageId)

    const results = await mainQuery
    return results
  }),
  getLatestByPackageId: protectedProcedure
    .input(
      z.object({
        packageId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Obtain the latest status of a package id using the group-wise maximum of a column.
      //
      // SQL equivalent:
      //   SELECT * FROM
      //     package_status_logs psl1
      //   WHERE psl1.created_at =
      //     (
      //       SELECT MAX(psl2.created_at)
      //       FROM package_status_logs psl2
      //       WHERE psl1.package_id = psl2.package_id
      //     )
      //   AND psl1.package_id = ?;
      //
      // Source: https://dev.mysql.com/doc/refman/8.0/en/example-maximum-column-group-row.html

      const psl1 = alias(packageStatusLogs, "psl1")
      const psl2 = alias(packageStatusLogs, "psl2")

      const subQuery = ctx.db
        .select({
          maxCreatedAt: sql`max(${psl2.createdAt})`,
        })
        .from(psl2)
        .where(eq(psl1.packageId, psl2.packageId))

      const mainQuery = ctx.db
        .select()
        .from(psl1)
        .where(
          and(
            eq(psl1.createdAt, subQuery),
            eq(psl1.packageId, input.packageId),
          ),
        )

      const results = await mainQuery

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
