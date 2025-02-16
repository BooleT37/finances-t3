import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "~/server/api/root";

export type ExpenseFromApi =
  inferRouterOutputs<AppRouter>["expense"]["getAll"][number];
