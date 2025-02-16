import Decimal from "decimal.js";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { connectUser, filterByUser } from "~/server/api/utils/linkCurrentUser";

export const forecastRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) =>
    ctx.db.forecast.findMany(filterByUser(ctx))
  ),
  upsert: protectedProcedure
    .input(
      z
        .object({
          categoryId: z.number(),
          subcategoryId: z.number().nullable(),
          month: z.number(),
          year: z.number(),
          sum: z.instanceof(Decimal).optional(),
          comment: z.string().optional(),
        })
        .refine(
          (data) => data.sum !== undefined || data.comment !== undefined,
          "You need to specify either sum or comment"
        )
        .refine((data) => !data.sum?.isNegative(), "Sum cannot be negative")
    )
    .mutation(async ({ ctx, input }) => {
      // cannot use upsert because the unique constraint does not support null subcategoryId
      const existed = await ctx.db.forecast.findFirst({
        where: {
          categoryId: input.categoryId,
          subcategoryId: input.subcategoryId,
          month: input.month,
          year: input.year,
          userId: ctx.session.user.id,
        },
      });
      if (existed) {
        return ctx.db.forecast.update({
          where: {
            id: existed.id,
          },
          data:
            input.sum !== undefined
              ? {
                  sum: input.sum,
                }
              : {
                  comment: input.comment,
                },
        });
      }
      return ctx.db.forecast.create({
        data: {
          category: {
            connect: {
              id: input.categoryId,
            },
          },
          subcategory:
            input.subcategoryId !== null
              ? {
                  connect: {
                    id: input.subcategoryId,
                  },
                }
              : undefined,
          month: input.month,
          year: input.year,
          comment: input.comment ?? "",
          sum: input.sum ?? new Decimal(0),
          ...connectUser(ctx),
        },
      });
    }),
});
