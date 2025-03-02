import { useCallback, useMemo } from "react";
import { useCategories } from "./allCategories";

export const useCategoryByName = () => {
  const { data: categories, isSuccess } = useCategories();
  const getCategoryByName = useCallback(
    (name: string) => {
      const found = categories?.find((category) => category.name === name);
      if (!found) {
        throw new Error(`Category with name ${name} not found`);
      }
      return found;
    },
    [categories]
  );
  return useMemo(() => {
    if (!isSuccess) {
      return { loaded: false as const };
    }
    return { loaded: true as const, getCategoryByName };
  }, [isSuccess, getCategoryByName]);
};
