import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const forecastRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.forecast.findMany();
  }),
});
