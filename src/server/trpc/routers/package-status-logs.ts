import { and, count, eq, isNull, lt, sql } from "drizzle-orm"
import { protectedProcedure, router } from "../trpc"
import { packageStatusLogs, packages } from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { alias } from "drizzle-orm/mysql-core"
import {
  getDescriptionForNewPackageStatusLog,
  SUPPORTED_PACKAGE_STATUSES,
  type PackageStatus,
} from "@/utils/constants"
import { DateTime } from "luxon"

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
  getByPackageId: protectedProcedure
    .input(
      z.object({
        packageId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(packageStatusLogs)
        .where(eq(packageStatusLogs.packageId, input.packageId))
    }),
  getLatest: protectedProcedure.query(async ({ ctx }) => {
    // Obtain the latest status using the group-wise maximum of a column.
    //
    // SQL equivalent:
    //  SELECT
    //    psl1.*
    //  FROM package_status_logs psl1
    //  LEFT JOIN package_status_logs psl2
    //  ON psl1.package_id = psl2.package_id
    //  AND psl1.created_at < psl2.created_at
    //  WHERE psl2.id IS NULL
    //
    // Source: https://dev.mysql.com/doc/refman/8.0/en/example-maximum-column-group-row.html

    const psl1 = alias(packageStatusLogs, "psl1")
    const psl2 = alias(packageStatusLogs, "psl2")

    return await ctx.db
      .select()
      .from(psl1)
      .leftJoin(
        psl2,
        and(
          eq(psl1.packageId, psl2.packageId),
          lt(psl1.createdAt, psl2.createdAt),
        ),
      )
      .where(isNull(psl2.id))
  }),
  getLatestByPackageId: protectedProcedure
    .input(
      z.object({
        packageId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Obtain the latest status of a package id using the group-wise maximum of a column.
      //
      // SQL equivalent:
      //  SELECT
      //    psl1.*
      //  FROM package_status_logs psl1
      //  LEFT JOIN package_status_logs psl2
      //  ON psl1.package_id = psl2.package_id
      //  AND psl1.created_at < psl2.created_at
      //  WHERE psl2.id IS NULL
      //  AND psl1.package_id = ?
      //
      // Source: https://dev.mysql.com/doc/refman/8.0/en/example-maximum-column-group-row.html

      const psl1 = alias(packageStatusLogs, "psl1")
      const psl2 = alias(packageStatusLogs, "psl2")
      const results = await ctx.db
        .select()
        .from(psl1)
        .leftJoin(
          psl2,
          and(
            eq(psl1.packageId, psl2.packageId),
            lt(psl1.createdAt, psl2.createdAt),
          ),
        )
        .where(and(isNull(psl2.id), eq(psl1.packageId, input.packageId)))

      if (results.length === 0)
        throw new TRPCError({
          code: "NOT_FOUND",
        })

      if (results.length > 1)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Expected 1 result, but got multiple.",
        })

      return results[0].psl1
    }),
  create: protectedProcedure
    .input(
      z
        .object({
          packageId: z.string(),
          status: z.custom<PackageStatus>((val) =>
            SUPPORTED_PACKAGE_STATUSES.includes(val as PackageStatus),
          ),
          createdAt: z.date(),
          createdById: z.string().length(28),
          warehouseName: z.string().optional(),
          forwarderName: z.string().optional(),
        })
        .superRefine(({ status, warehouseName }, ctx) => {
          if (
            (status === "IN_WAREHOUSE" ||
              status === "TRANSFERRING_WAREHOUSE") &&
            typeof warehouseName === "undefined"
          ) {
            ctx.addIssue({
              code: "custom",
              message:
                "Warehouse name must be provided when setting this status.",
            })
          } else if (
            (status === "TRANSFERRING_FORWARDER" ||
              status === "TRANSFERRED_FORWARDER") &&
            typeof warehouseName === "undefined"
          ) {
            ctx.addIssue({
              code: "custom",
              message:
                "Forwarder name must be provided when setting this status.",
            })
          }
        }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        await tx
          .update(packages)
          .set({
            status: input.status,
          })
          .where(eq(packages.id, input.packageId))

        const createdAt = DateTime.now().toISO()

        if (
          input.status === "IN_WAREHOUSE" ||
          input.status === "TRANSFERRING_WAREHOUSE"
        )
          await tx.insert(packageStatusLogs).values({
            ...input,
            description: getDescriptionForNewPackageStatusLog({
              status: input.status,
              warehouseName: input.warehouseName!,
            }),
            createdAt,
          })
        else if (
          input.status === "TRANSFERRING_FORWARDER" ||
          input.status === "TRANSFERRED_FORWARDER"
        )
          await tx.insert(packageStatusLogs).values({
            ...input,
            description: getDescriptionForNewPackageStatusLog({
              status: input.status,
              forwarderName: input.forwarderName!,
            }),
            createdAt,
          })
        else
          await tx.insert(packageStatusLogs).values({
            ...input,
            description: getDescriptionForNewPackageStatusLog({
              status: input.status,
            }),
            createdAt,
          })
      })
    }),
  createMany: protectedProcedure
    .input(
      z.object({
        newStatusLogs: z
          .object({
            packageId: z.string(),
            status: z.custom<PackageStatus>((val) =>
              SUPPORTED_PACKAGE_STATUSES.includes(val as PackageStatus),
            ),
            description: z.string(),
            createdAt: z.string(),
            createdById: z.string().length(28),
          })
          .array()
          .nonempty(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(packageStatusLogs).values(input.newStatusLogs)
    }),
  deleteById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(packageStatusLogs)
        .where(eq(packageStatusLogs.id, input.id))
    }),

  getDeliverySummary: protectedProcedure.query(async ({ ctx }) => {
    const currentYear = new Date().getFullYear()

    const deliverySummaryCount = await ctx.db
      .select({
        value: count(),
        year: sql`YEAR(${packageStatusLogs.createdAt})`,
        month: sql`MONTH(${packageStatusLogs.createdAt})`,
      })
      .from(packageStatusLogs)
      .where(
        and(
          eq(packageStatusLogs.status, "DELIVERED"),
          eq(sql`YEAR(${packageStatusLogs.createdAt})`, currentYear),
        ),
      )
      .groupBy(
        sql`YEAR(${packageStatusLogs.createdAt})`,
        sql`MONTH(${packageStatusLogs.createdAt})`,
      )

    return {
      deliverySummaryCount,
    }
  }),
})
