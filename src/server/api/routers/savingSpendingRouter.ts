import {
  SavingSpendingCreateWithoutUserInputSchema,
  SavingSpendingUpdateWithoutUserInputSchema,
} from "prisma/generated/zod";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { connectUser, filterByUser } from "~/server/api/utils/linkCurrentUser";

export const savingSpendingRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => ctx.db.savingSpending.findMany({
      ...filterByUser(ctx),
      include: { categories: true },
    })),
  create: protectedProcedure
    .input(SavingSpendingCreateWithoutUserInputSchema)
    .mutation(({ input, ctx }) =>
      ctx.db.savingSpending.create({
        data: {
          ...input,
          ...connectUser(ctx),
        },
        include: { categories: true },
      })
    ),
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: SavingSpendingUpdateWithoutUserInputSchema,
      })
    )
    .mutation(({ input: { data, id }, ctx }) =>
      ctx.db.savingSpending.update({
        data,
        where: { id },
        include: { categories: true },
      })
    ),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input: { id }, ctx }) =>
      // all categories are also removed via "onUpdate: cascade"!
      ctx.db.savingSpending.delete({ where: { id } })
    ),
  toggle: protectedProcedure
    .input(z.object({ id: z.number(), completed: z.boolean() }))
    .mutation(({ input: { completed, id }, ctx }) =>
      ctx.db.savingSpending.update({
        data: {
          completed,
        },
        where: {
          id,
        },
      })
    ),
});
