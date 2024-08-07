import {
  ExpenseCreateWithoutUserInputObjectSchema,
  ExpenseUpdateWithoutUserInputObjectSchema,
} from "prisma/generated/schemas";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { connectUser, filterByUser } from "~/server/api/utils/linkCurrentUser";

export const expenseRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) =>
    ctx.prisma.expense.findMany({
      ...filterByUser(ctx),
      include: { components: true },
    })
  ),
  create: protectedProcedure
    .input(ExpenseCreateWithoutUserInputObjectSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.expense.create({
        data: {
          ...input,
          ...connectUser(ctx),
        },
        include: { components: true },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: ExpenseUpdateWithoutUserInputObjectSchema,
      })
    )
    .mutation(({ ctx, input: { data, id } }) =>
      ctx.prisma.expense.update({
        data,
        where: { id },
        include: { components: true },
      })
    ),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input: { id } }) =>
      ctx.prisma.expense.delete({ where: { id } })
    ),
  deleteComponent: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input: { id } }) =>
      ctx.prisma.expenseComponent.delete({ where: { id } })
    ),
});
