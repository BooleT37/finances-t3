import type { FormInstance } from "antd";
import { useCallback, useState } from "react";
import Category from "~/models/Category";
import { dataStores } from "~/stores/dataStores";
import type { FormValues } from "./CategoryModal";
import categoryModalViewModel from "./categoryModalViewModel";

export const useHandleCategorySubmit = (form: FormInstance<FormValues>) => {
  const [loading, setLoading] = useState(false);
  const { categoryId, close } = categoryModalViewModel;
  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (categoryId === null) {
        await dataStores.categoriesStore.createCategory(
          new Category(
            -1,
            values.name,
            values.shortname,
            values.icon,
            values.type,
            values.isIncome,
            values.isContinuous,
            values.subcategories
          )
        );
      } else {
        await dataStores.categoriesStore.updateCategory(
          new Category(
            categoryId,
            values.name,
            values.shortname,
            values.icon,
            values.type,
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
  }, [categoryId, close, form]);

  return { loading, handleSubmit };
};
