import { useCallback } from "react";
import { useCategories } from "./allCategories";

export const useGetCategoryById = () => {
  const { data: categories, isSuccess } = useCategories();
  const getCategoryById = useCallback(
    (id: number) => {
      const found = categories?.find((category) => category.id === id);
      if (!found) {
        throw new Error("Category not found");
      }
      return found;
    },
    [categories]
  );
  if (!isSuccess) {
    return { loaded: false as const };
  }
  return { loaded: true as const, getCategoryById };
};
