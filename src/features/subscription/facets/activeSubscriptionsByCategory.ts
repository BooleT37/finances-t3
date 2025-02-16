import { groupBy } from "lodash";
import { useMemo } from "react";
import { useActiveSubscriptions } from "./activeSubscriptions";

export const useActiveSubscriptionsByCategory = () => {
  const activeSubscriptions = useActiveSubscriptions();
  return useMemo(
    () => groupBy(activeSubscriptions, "category.name"),
    [activeSubscriptions]
  );
};
