import { groupBy } from "lodash";
import { useMemo } from "react";
import { useSubscriptions } from "./allSubscriptions";

export const useSubscriptionsByCategory = () => {
  const { data: subscriptions } = useSubscriptions();
  return useMemo(
    () => (subscriptions ? groupBy(subscriptions, "category.name") : null),
    [subscriptions]
  );
};
