import type { FormInstance } from "antd";
import { useCallback, useState } from "react";
import {
  useCreateCategory,
  useUpdateCategory,
} from "~/features/category/api/categoriesApi";
import Category from "~/features/category/Category";
import type { FormValues } from "./CategoryModal";
import { useCategoryModalContext } from "./categoryModalContext";

export const useHandleCategorySubmit = (form: FormInstance<FormValues>) => {
  const [loading, setLoading] = useState(false);
  const { categoryId, close, currentCategory } = useCategoryModalContext();
  const currentCategoryType = currentCategory?.type ?? null;
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  // persistExpenseCategoriesOrder(table, row.original.isIncome);
  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (categoryId === null) {
        await createCategory.mutateAsync(
          new Category(
            -1,
            values.name,
            values.shortname,
            values.icon,
            null,
            values.isIncome,
            values.isContinuous,
            values.subcategories
          )
        );
      } else {
        await updateCategory.mutateAsync(
          new Category(
            categoryId,
            values.name,
            values.shortname,
            values.icon,
            currentCategoryType,
            values.isIncome,
            values.isContinuous,
            values.subcategories
          )
        );
      }
      form.resetFields();
      close();
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      }
      console.log("Validate Failed:", e);
    } finally {
      setLoading(false);
    }
  }, [
    categoryId,
    close,
    createCategory,
    currentCategoryType,
    form,
    updateCategory,
  ]);

  return { loading, handleSubmit };
};
