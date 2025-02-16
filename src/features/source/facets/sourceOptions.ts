import { useMemo } from "react";
import { useSources } from "./allSources";

export const useSourceOptions = () => {
  const { data: sources } = useSources();
  return useMemo(() => sources?.map((s) => s.asOption) ?? [], [sources]);
};
