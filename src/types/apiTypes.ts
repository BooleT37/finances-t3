import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "~/server/api/root";

export type ExpenseFromApi =
  inferRouterOutputs<AppRouter>["expense"]["getAll"][number];
