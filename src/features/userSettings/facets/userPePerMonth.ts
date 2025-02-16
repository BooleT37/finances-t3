import { useMemo } from "react";
import { useUserSettings } from "./allUserSettings";

export const useUserPePerMonth = () => {
  const { data: settings } = useUserSettings();
  return useMemo(() => settings?.pePerMonth ?? null, [settings]);
};
