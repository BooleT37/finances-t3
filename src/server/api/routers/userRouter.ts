import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { defaultCategories } from "../utils/defaultCategories";

export const userRouter = createTRPCRouter({
  initialUserSetupIfNeeded: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input: { userId } }) => {
      const user = await ctx.db.user.findFirst({ where: { id: userId } });
      if (!user || user.setupDone) {
        return;
      }
      await ctx.db.category.createMany({
        data: defaultCategories.map((c) => ({ ...c, userId })),
      });
      await ctx.db.user.update({
        data: {
          setupDone: true,
        },
        where: {
          id: userId,
        },
      });
      const categories = await ctx.db.category.findMany();
      await ctx.db.userSetting.create({
        data: {
          userId,
          expenseCategoriesOrder: categories
            .filter((c) => !c.isIncome)
            .map((c) => c.id),
          incomeCategoriesOrder: categories
            .filter((c) => c.isIncome)
            .map((c) => c.id),
        },
      });
    }),
});
