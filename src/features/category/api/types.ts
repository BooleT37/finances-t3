import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";

export { type Category as ApiCategory } from "@prisma/client";
export type ApiCategoryWithSubcategories =
  inferRouterOutputs<AppRouter>["categories"]["getAll"][number];
