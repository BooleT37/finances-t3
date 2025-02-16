import { useMemo } from "react";
import { useSources } from "./allSources";

export const useSourceTableItems = () => {
  const { data: sources } = useSources();
  return useMemo(() => sources?.map((s) => s.tableItem) ?? [], [sources]);
};
