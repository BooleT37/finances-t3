import { useCallback } from "react";
import { useSources } from "./allSources";

export const useSourceById = () => {
  const { data: sources, isSuccess } = useSources();
  const getSourceById = useCallback(
    (id: number) => {
      const source = sources?.find((source) => source.id === id);
      if (!source) {
        throw new Error(`Cannot find source with id ${id}`);
      }
      return source;
    },
    [sources]
  );
  if (!isSuccess) {
    return { loaded: false as const };
  }
  return { loaded: true as const, getSourceById };
};
