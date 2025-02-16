import { useMemo } from "react";
import { useSubscriptions } from "./allSubscriptions";

export const useActiveSubscriptions = () => {
  const { data: subscriptions } = useSubscriptions();
  return useMemo(
    () => subscriptions?.filter((s) => s.active) ?? [],
    [subscriptions]
  );
};
