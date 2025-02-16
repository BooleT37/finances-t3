import { useQuery } from "@tanstack/react-query";
import Category from "../Category";
import Subcategory from "../Subcategory";
import { categoriesQueryParams } from "../api/categoriesApi";
import type { ApiCategoryWithSubcategories } from "../api/types";

function adaptCategoryFromApi(
  category: ApiCategoryWithSubcategories
): Category {
  return new Category(
    category.id,
    category.name,
    category.shortname,
    category.icon,
    category.type,
    category.isIncome,
    category.isContinuous,
    category.subcategories.map(
      (subcategory) => new Subcategory(subcategory.id, subcategory.name)
    )
  );
}

export const useCategories = () => {
  return useQuery({
    ...categoriesQueryParams,
    select: (data) => data.map(adaptCategoryFromApi),
  });
};
