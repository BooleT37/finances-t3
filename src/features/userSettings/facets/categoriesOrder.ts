import { useMemo } from "react";
import { useUserSettings } from "./allUserSettings";

export const useExpenseCategoriesOrder = () => {
  const { data: settings } = useUserSettings();
  return useMemo(() => settings?.expenseCategoriesOrder, [settings]);
};

export const useIncomeCategoriesOrder = () => {
  const { data: settings } = useUserSettings();
  return useMemo(() => settings?.incomeCategoriesOrder, [settings]);
};
