import { useCallback } from "react";
import { dataStores } from "~/stores/dataStores";

export const useHandleCommentChange = ({
  month,
  year,
}: {
  month: number;
  year: number;
}) => {
  return useCallback(
    async (
      categoryId: number,
      subcategoryId: number | null,
      comment: string
    ) => {
      await dataStores.forecastStore.changeForecastComment(
        dataStores.categoriesStore.getById(categoryId),
        subcategoryId !== null
          ? dataStores.categoriesStore.getSubcategoryById(
              categoryId,
              subcategoryId
            )
          : null,
        month,
        year,
        comment
      );
    },
    [month, year]
  );
};
