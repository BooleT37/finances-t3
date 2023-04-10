import { createTRPCRouter } from "~/server/api/trpc";
import { categoriesRouter } from "./routers/categoriesRouter";
import { expenseRouter } from "./routers/expenseRouter";
import { forecastRouter } from "./routers/forecastRouter";
import { savingSpendingRouter } from "./routers/savingSpendingRouter";
import { sourcesRouter } from "./routers/sourcesRouter";
import { subscriptionRouter } from "./routers/subscriptionRouter";
import { userRouter } from "./routers/userRouter";
import { userSettingsRouter } from "./routers/userSettingsRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  expense: expenseRouter,
  forecast: forecastRouter,
  savingSpending: savingSpendingRouter,
  sources: sourcesRouter,
  sub: subscriptionRouter,
  userSettings: userSettingsRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
