import { ForecastUpsertSchema } from "prisma/generated/schemas";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const forecastRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.forecast.findMany();
  }),
  upsert: publicProcedure
    .input(ForecastUpsertSchema)
    .mutation(({ ctx, input }) => ctx.prisma.forecast.upsert(input)),
});
