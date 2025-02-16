import { useCallback } from "react";
import { useSubscriptions } from "./allSubscriptions";

export const useSubscriptionById = () => {
  const { data: subscriptions, isSuccess } = useSubscriptions();
  const getSubscriptionById = useCallback(
    (id: number) => {
      const subscription = subscriptions?.find((s) => s.id === id);
      if (!subscription) {
        throw new Error(`Cannot find subscription with id ${id}`);
      }
      return subscription;
    },
    [subscriptions]
  );
  if (!isSuccess) {
    return { loaded: false as const };
  }
  return { loaded: true as const, getSubscriptionById };
};
