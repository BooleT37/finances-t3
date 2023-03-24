import { createTRPCRouter } from "~/server/api/trpc";
import { expenseRouter } from "./routers/expenseRouter";
import { forecastRouter } from "./routers/forecastRouter";
import { savingSpendingRouter } from "./routers/savingSpendingRouter";
import { subscriptionRouter } from "./routers/subscriptionRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  expense: expenseRouter,
  sub: subscriptionRouter,
  savingSpending: savingSpendingRouter,
  forecast: forecastRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
