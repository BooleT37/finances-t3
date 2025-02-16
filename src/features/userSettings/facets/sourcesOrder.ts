import { useMemo } from "react";
import { useUserSettings } from "./allUserSettings";

export const useSourcesOrder = () => {
  const { data: settings } = useUserSettings();
  return useMemo(() => settings?.sourcesOrder ?? [], [settings]);
};
