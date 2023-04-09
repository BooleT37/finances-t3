import type { Subscription as ApiSubscription } from "@prisma/client";
import dayjs from "dayjs";
import Subscription from "~/models/Subscription";
import sources from "~/readonlyStores/sources";
import categoriesStore from "~/stores/categoriesStore";

export function adaptSubscriptionFromApi(
  subscription: ApiSubscription
): Subscription {
  return new Subscription(
    subscription.id,
    subscription.name,
    subscription.cost,
    categoriesStore.getById(subscription.categoryId),
    subscription.period,
    dayjs(subscription.firstDate),
    subscription.active,
    subscription.sourceId === null
      ? null
      : sources.getById(subscription.sourceId)
  );
}
