import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { filterByUser } from "~/server/api/utils/linkCurrentUser";

export const categoriesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.category.findMany({
      include: { subcategories: true },
      ...filterByUser(ctx),
    });
  }),
});
