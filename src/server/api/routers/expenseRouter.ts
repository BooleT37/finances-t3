import {
  ExpenseCreateManyInputObjectSchema,
  ExpenseCreateWithoutUserInputObjectSchema,
  ExpenseUpdateWithoutUserInputObjectSchema,
} from "prisma/generated/schemas";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { connectUser, filterByUser } from "~/server/api/utils/linkCurrentUser";

export const expenseRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) =>
    ctx.db.expense.findMany({
      ...filterByUser(ctx),
      include: { components: true },
    })
  ),
  create: protectedProcedure
    .input(ExpenseCreateWithoutUserInputObjectSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.expense.create({
        data: {
          ...input,
          ...connectUser(ctx),
        },
        include: { components: true },
      });
    }),
  createMany: protectedProcedure
    .input(z.array(ExpenseCreateManyInputObjectSchema))
    .mutation(({ ctx, input }) =>
      ctx.db.expense.createManyAndReturn({
        data: input.map((data) => ({
          ...data,
          userId: ctx.session.user.id,
        })),
      })
    ),
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: ExpenseUpdateWithoutUserInputObjectSchema,
      })
    )
    .mutation(({ ctx, input: { data, id } }) =>
      ctx.db.expense.update({
        data,
        where: { id },
        include: { components: true },
      })
    ),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input: { id } }) =>
      ctx.db.expense.delete({ where: { id } })
    ),
  deleteComponent: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input: { id } }) =>
      ctx.db.expenseComponent.delete({ where: { id } })
    ),
});
