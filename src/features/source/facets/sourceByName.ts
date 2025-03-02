import { useCallback, useMemo } from "react";
import { useSources } from "./allSources";

export const useSourceByName = () => {
  const { data: sources, isSuccess } = useSources();
  const getSourceByName = useCallback(
    (name: string) => {
      const source = sources?.find((source) => source.name === name);
      if (!source) {
        throw new Error(`Cannot find source with name ${name}`);
      }
      return source;
    },
    [sources]
  );
  return useMemo(() => {
    if (!isSuccess) {
      return { loaded: false as const };
    }
    return { loaded: true as const, getSourceByName };
  }, [isSuccess, getSourceByName]);
};
