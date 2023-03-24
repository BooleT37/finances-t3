import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const sourcesRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.source.findMany();
  }),
});
