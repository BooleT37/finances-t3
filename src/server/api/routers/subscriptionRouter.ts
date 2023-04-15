import {
  SubscriptionCreateWithoutUserInputObjectSchema,
  SubscriptionUpdateWithoutUserInputObjectSchema,
} from "prisma/generated/schemas";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { connectUser, filterByUser } from "~/server/api/utils/linkCurrentUser";

export const subscriptionRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.subscription.findMany(filterByUser(ctx));
  }),
  toggle: protectedProcedure
    .input(z.object({ id: z.number(), active: z.boolean() }))
    .mutation(({ ctx, input: { active, id } }) =>
      ctx.prisma.subscription.update({ data: { active }, where: { id } })
    ),
  create: protectedProcedure
    .input(SubscriptionCreateWithoutUserInputObjectSchema)
    .mutation(({ ctx, input }) => {
      console.log("====== USER ID: =======", ctx.session.user.id);
      return ctx.prisma.subscription.create({
        data: { ...input, ...connectUser(ctx) },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: SubscriptionUpdateWithoutUserInputObjectSchema,
      })
    )
    .mutation(({ ctx, input: { data, id } }) =>
      ctx.prisma.subscription.update({ data, where: { id } })
    ),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input: { id } }) =>
      ctx.prisma.subscription.delete({ where: { id } })
    ),
});
