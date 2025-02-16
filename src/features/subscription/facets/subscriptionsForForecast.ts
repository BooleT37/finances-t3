import { useCallback } from "react";
import { type ForecastSubscriptionsItem } from "~/features/forecast/types/forecastTypes";
import type Subscription from "../Subscription";
import { useActiveSubscriptions } from "./activeSubscriptions";

const subscriptionToItem = (
  subscription: Subscription
): ForecastSubscriptionsItem => ({
  cost: subscription.cost,
  name: subscription.name,
});

export const useGetSubscriptionsForForecast = () => {
  const activeSubscriptions = useActiveSubscriptions();
  return useCallback(
    (
      month: number,
      year: number,
      categoryId: number | null,
      subcategoryId: number | null
    ) =>
      activeSubscriptions
        .filter(
          (subscription) =>
            (categoryId === null || subscription.category.id === categoryId) &&
            subscription.subcategoryId === subcategoryId &&
            subscription.isInMonth(month, year)
        )
        .map(subscriptionToItem),
    [activeSubscriptions]
  );
};
