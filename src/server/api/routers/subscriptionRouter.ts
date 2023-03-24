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
});
