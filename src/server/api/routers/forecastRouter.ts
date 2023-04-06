import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { connectUser, filterByUser } from "~/server/api/utils/linkCurrentUser";

export const forecastRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.forecast.findMany(filterByUser(ctx));
  }),
  upsert: protectedProcedure
    .input(
      z
        .object({
          categoryId: z.number(),
          month: z.number(),
          year: z.number(),
          sum: z.number().optional(),
          comment: z.string().optional(),
        })
        .refine(
          (data) => data.sum !== undefined || data.comment !== undefined,
          "You need to specify either sum or comment"
        )
    )
    .mutation(({ ctx, input }) =>
      ctx.prisma.forecast.upsert({
        where: {
          categoryId_month_year_userId: {
            categoryId: input.categoryId,
            month: input.month,
            year: input.year,
            userId: ctx.session.user.id,
          },
        },
        create: {
          category: {
            connect: {
              id: input.categoryId,
            },
          },
          month: input.month,
          year: input.year,
          comment: input.comment ?? "",
          sum: input.sum ?? 0,
          ...connectUser(ctx),
        },
        update:
          input.sum !== undefined
            ? {
                sum: input.sum,
              }
            : {
                comment: input.comment,
              },
      })
    ),
});
