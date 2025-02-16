import dayjs from "dayjs";
import { useMemo } from "react";
import { useUserSettings } from "./allUserSettings";

export const useUserSavings = () => {
  const { data: settings } = useUserSettings();
  return useMemo(() => {
    if (!settings?.savings || !settings?.savingsDate) return undefined;

    return {
      sum: settings.savings,
      date: dayjs(settings.savingsDate),
    };
  }, [settings]);
};
