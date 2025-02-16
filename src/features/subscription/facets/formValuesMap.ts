import { useCallback, useMemo } from "react";
import type { SubscriptionFormValues } from "../Subscription";
import { useSubscriptions } from "./allSubscriptions";

export const useSubscriptionFormValuesMap = () => {
  const { data: subscriptions } = useSubscriptions();
  return useMemo(
    () =>
      subscriptions
        ?.map((subscription) => subscription.toFormValues)
        .reduce<Record<string, SubscriptionFormValues>>(
          (
            acc: Record<string, SubscriptionFormValues>,
            curr: SubscriptionFormValues
          ) => ({
            ...acc,
            [curr.id]: curr,
          }),
          {}
        ) ?? {},
    [subscriptions]
  );
};

export const useGetSubscriptionFormValuesById = () => {
  const formValuesMap = useSubscriptionFormValuesMap();
  return useCallback(
    (id: number) => {
      const found = formValuesMap[id];

      if (found === undefined) {
        throw new Error(`Can't find subscription by id ${id}`);
      }

      return found;
    },
    [formValuesMap]
  );
};
