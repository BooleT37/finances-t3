import { useMemo } from "react";
import type Subscription from "../Subscription";
import { useSubscriptions } from "./allSubscriptions";

export const useSubscriptionsMap = () => {
  const { data: subscriptions } = useSubscriptions();
  return useMemo(
    () =>
      subscriptions?.reduce<Record<string, Subscription>>(
        (acc: Record<string, Subscription>, curr: Subscription) => ({
          ...acc,
          [curr.id]: curr,
        }),
        {}
      ),
    [subscriptions]
  );
};
