import { useCallback } from "react";
import { useChangeForecastComment } from "~/features/forecast/facets/changeForecastComment";

export const useHandleCommentChange = ({
  month,
  year,
}: {
  month: number;
  year: number;
}) => {
  const changeForecastComment = useChangeForecastComment();

  return useCallback(
    async (
      categoryId: number,
      subcategoryId: number | null,
      comment: string
    ) => {
      await changeForecastComment({
        categoryId,
        subcategoryId,
        month,
        year,
        comment,
      });
    },
    [changeForecastComment, month, year]
  );
};
