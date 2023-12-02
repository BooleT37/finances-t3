import {
  ExpenseCreateWithoutUserInputObjectSchema,
  ExpenseUpdateWithoutUserInputObjectSchema,
} from "prisma/generated/schemas";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { connectUser, filterByUser } from "~/server/api/utils/linkCurrentUser";

export const expenseRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.expense.findMany(filterByUser(ctx));
  }),
  create: protectedProcedure
    .input(ExpenseCreateWithoutUserInputObjectSchema)
    .mutation(({ ctx, input }) => {
      console.log(input);
      return ctx.prisma.expense.create({
        data: {
          ...input,
          ...connectUser(ctx),
        },
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
      })
    ),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input: { id } }) =>
      ctx.prisma.expense.delete({ where: { id } })
    ),
});
