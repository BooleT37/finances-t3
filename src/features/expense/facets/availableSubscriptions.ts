import { type Dayjs } from "dayjs";
import { useCallback } from "react";
import type Category from "~/features/category/Category";
import { useSubscriptions } from "~/features/subscription/facets/allSubscriptions";
import type Subscription from "~/features/subscription/Subscription";
import { useExpenses } from "./allExpenses";

interface SubscriptionForPeriod {
  subscription: Subscription;
  firstDate: Dayjs;
}

export const useGetAvailableSubscriptions = () => {
  const { data: expenses } = useExpenses();
  const { data: subscriptions } = useSubscriptions();

  return useCallback(
    (startDate: Dayjs, endDate: Dayjs, category?: Category) => {
      if (!expenses || !subscriptions) {
        return [];
      }
      const allSubscriptions = category
        ? subscriptions.filter((s) => s.category.id === category.id)
        : subscriptions;

      let subscriptionsForPeriod = allSubscriptions
        .filter((s) => s.active)
        .map((subscription): SubscriptionForPeriod | null => {
          const firstDate = subscription.firstDateInInterval(
            startDate,
            endDate
          );
          if (firstDate) {
            return {
              subscription,
              firstDate,
            };
          }
          return null;
        })
        .filter(
          (subscription): subscription is SubscriptionForPeriod =>
            !!subscription
        );

      if (subscriptionsForPeriod.length === 0) {
        return [];
      }

      const allExpenses = category
        ? expenses.filter((e) => e.category.id === category.id)
        : expenses;

      const addedSubscriptionsIds = allExpenses
        .filter(
          (
            expense
          ): expense is typeof expense & {
            subscription: NonNullable<(typeof expense)["subscription"]>;
          } =>
            expense.subscription !== null &&
            expense.date.isBetween(startDate, endDate, "day", "[]")
        )
        .map((e) => e.subscription.id);

      subscriptionsForPeriod = subscriptionsForPeriod.filter(
        (subscription) =>
          !addedSubscriptionsIds.includes(subscription.subscription.id)
      );

      return subscriptionsForPeriod;
    },
    [expenses, subscriptions]
  );
};
