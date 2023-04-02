import {
  SubscriptionCreateInputObjectSchema,
  SubscriptionUpdateInputObjectSchema,
} from "prisma/generated/schemas";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const subscriptionRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.subscription.findMany();
  }),
  toggle: publicProcedure
    .input(z.object({ id: z.number(), active: z.boolean() }))
    .mutation(({ ctx, input: { active, id } }) =>
      ctx.prisma.subscription.update({ data: { active }, where: { id } })
    ),
  create: publicProcedure
    .input(SubscriptionCreateInputObjectSchema)
    .mutation(({ ctx, input }) =>
      ctx.prisma.subscription.create({ data: input })
    ),
  update: publicProcedure
    .input(
      z.object({ id: z.number(), data: SubscriptionUpdateInputObjectSchema })
    )
    .mutation(({ ctx, input: { data, id } }) =>
      ctx.prisma.subscription.update({ data, where: { id } })
    ),
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input: { id } }) =>
      ctx.prisma.subscription.delete({ where: { id } })
    ),
});
