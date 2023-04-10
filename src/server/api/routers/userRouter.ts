import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { defaultCategories } from "../utils/defaultCategories";

export const userRouter = createTRPCRouter({
  initialUserSetupIfNeeded: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input: { userId } }) => {
      const user = await ctx.prisma.user.findFirst({ where: { id: userId } });
      if (!user || user.setupDone) {
        return;
      }
      await ctx.prisma.category.createMany({
        data: defaultCategories.map((c) => ({ ...c, userId })),
      });
      await ctx.prisma.user.update({
        data: {
          setupDone: true,
        },
        where: {
          id: userId,
        },
      });
    }),
});
