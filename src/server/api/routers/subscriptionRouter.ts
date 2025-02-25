import {
  SubscriptionCreateWithoutUserInputSchema,
  SubscriptionUpdateWithoutUserInputSchema,
} from "prisma/generated/zod";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { connectUser, filterByUser } from "~/server/api/utils/linkCurrentUser";
import {
  isDecimalFieldUpdateOperationsInput,
  isNegative,
} from "../utils/decimalUtils";

export const subscriptionRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => ctx.db.subscription.findMany(filterByUser(ctx))),
  toggle: protectedProcedure
    .input(z.object({ id: z.number(), active: z.boolean() }))
    .mutation(({ ctx, input: { active, id } }) =>
      ctx.db.subscription.update({ data: { active }, where: { id } })
    ),
  create: protectedProcedure
    .input(
      SubscriptionCreateWithoutUserInputSchema.refine(
        (data) => !isNegative(data.cost),
        "Cost cannot be negative"
      )
    )
    .mutation(({ ctx, input }) => ctx.db.subscription.create({
        data: { ...input, ...connectUser(ctx) },
      })),
  update: protectedProcedure
    .input(
      z
        .object({
          id: z.number(),
          data: SubscriptionUpdateWithoutUserInputSchema,
        })
        .refine(
          ({ data }) =>
            data.cost === undefined ||
            isDecimalFieldUpdateOperationsInput(data.cost) ||
            !isNegative(data.cost),
          "Cost cannot be negative"
        )
    )
    .mutation(({ ctx, input: { data, id } }) =>
      ctx.db.subscription.update({ data, where: { id } })
    ),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input: { id } }) =>
      ctx.db.subscription.delete({ where: { id } })
    ),
});
