import { useCallback } from "react";
import { useGetCategoryById } from "./categoryById";

export const useSubcategoryById = () => {
  const categoryById = useGetCategoryById();
  const getSubcategoryById = useCallback(
    (categoryId: number, subcategoryId: number) => {
      const category = categoryById.loaded
        ? categoryById.getCategoryById(categoryId)
        : null;
      if (!category) {
        throw new Error(`Category with id ${categoryId} not found`);
      }
      const subcategory = category.subcategories.find(
        (subcategory) => subcategory.id === subcategoryId
      );
      if (!subcategory) {
        throw new Error(`Subcategory with id ${subcategoryId} not found`);
      }
      return subcategory;
    },
    [categoryById]
  );
  if (!categoryById.loaded) {
    return { loaded: false as const };
  }
  return { loaded: true as const, getSubcategoryById };
};
