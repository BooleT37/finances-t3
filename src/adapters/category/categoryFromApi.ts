import { type inferRouterOutputs } from "@trpc/server";
import Category from "~/models/Category";
import Subcategory from "~/models/Subcategory";
import { type AppRouter } from "~/server/api/root";

export function adaptCategoryFromApi(
  category: inferRouterOutputs<AppRouter>["categories"]["getAll"][number]
): Category {
  return new Category(
    category.id,
    category.name,
    category.shortname,
    category.isIncome,
    category.isContinuous,
    category.subcategories.map(
      (subcategory) => new Subcategory(subcategory.id, subcategory.name)
    )
  );
}
