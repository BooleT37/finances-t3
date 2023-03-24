import {
  ExpenseCreateInputObjectSchema,
  ExpenseUpdateInputObjectSchema,
} from "prisma/generated/schemas";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const expenseRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.expense.findMany();
  }),
  create: publicProcedure
    .input(ExpenseCreateInputObjectSchema)
    .mutation(({ ctx, input }) => ctx.prisma.expense.create({ data: input })),
  update: publicProcedure
    .input(z.object({ id: z.number(), data: ExpenseUpdateInputObjectSchema }))
    .mutation(({ ctx, input: { data, id } }) =>
      ctx.prisma.expense.update({ data, where: { id } })
    ),
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input: { id } }) =>
      ctx.prisma.expense.delete({ where: { id } })
    ),
});
