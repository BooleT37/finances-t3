import { useCallback, useMemo } from "react";
import { useSavingSpendings } from "./allSavingSpendings";

export const useSavingSpendingById = () => {
  const { data: savingSpendings, isSuccess } = useSavingSpendings();
  const getSavingSpendingById = useCallback(
    (id: number) => {
      const spending = savingSpendings?.find((s) => s.id === id);
      if (!spending) {
        throw new Error(`Cannot find spending with id ${id}`);
      }
      return spending;
    },
    [savingSpendings]
  );
  return useMemo(() => {
    if (!isSuccess) {
      return { loaded: false as const };
    }
    return { loaded: true as const, getSavingSpendingById };
  }, [isSuccess, getSavingSpendingById]);
};
