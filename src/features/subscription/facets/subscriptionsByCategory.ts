import { groupBy } from "lodash";
import { useMemo } from "react";
import { useSubscriptions } from "./allSubscriptions";

export const useGetSubscriptionsByCategory = () => {
  const { data: subscriptions } = useSubscriptions();
  return useMemo(
    () => groupBy(subscriptions ?? [], "category.name"),
    [subscriptions]
  );
};
