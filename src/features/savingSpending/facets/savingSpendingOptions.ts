import { useCallback, useMemo } from "react";
import { useSavingSpendings } from "./allSavingSpendings";

export const useSavingSpendingOptions = () => {
  const { data: savingSpendings } = useSavingSpendings();
  return useMemo(
    () => savingSpendings?.map((s) => s.asOption) ?? [],
    [savingSpendings]
  );
};

export const useGetSavingSpendingCategoriesOptions = () => {
  const { data: savingSpendings } = useSavingSpendings();
  return useCallback(
    (id: number) => {
      const spending = savingSpendings?.find((s) => s.id === id);
      return spending?.categories.map((c) => c.asOption) ?? [];
    },
    [savingSpendings]
  );
};
