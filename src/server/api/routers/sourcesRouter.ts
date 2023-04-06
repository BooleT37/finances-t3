import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { filterByUser } from "~/server/api/utils/linkCurrentUser";

export const sourcesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.source.findMany(filterByUser(ctx));
  }),
});
