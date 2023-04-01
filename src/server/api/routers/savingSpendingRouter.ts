import {
  SavingSpendingCreateInputObjectSchema,
  SavingSpendingUpdateInputObjectSchema,
} from "prisma/generated/schemas";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const savingSpendingRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.savingSpending.findMany({
      include: { categories: true },
    });
  }),
  create: publicProcedure
    .input(SavingSpendingCreateInputObjectSchema)
    .mutation(({ input, ctx }) =>
      ctx.prisma.savingSpending.create({
        data: input,
        include: { categories: true },
      })
    ),
  update: publicProcedure
    .input(
      z.object({ id: z.number(), data: SavingSpendingUpdateInputObjectSchema })
    )
    .mutation(({ input: { data, id }, ctx }) =>
      ctx.prisma.savingSpending.update({
        data,
        where: { id },
        include: { categories: true },
      })
    ),
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input: { id }, ctx }) =>
      // all categories are also removed via "onUpdate: cascade"!
      ctx.prisma.savingSpending.delete({ where: { id } })
    ),
  toggle: publicProcedure
    .input(z.object({ id: z.number(), completed: z.boolean() }))
    .mutation(({ input: { completed, id }, ctx }) =>
      ctx.prisma.savingSpending.update({
        data: {
          completed,
        },
        where: {
          id,
        },
      })
    ),
});
