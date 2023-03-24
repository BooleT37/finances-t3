import type { Subscription as ApiSubscription } from "@prisma/client";
import dayjs from "dayjs";
import Subscription from "~/models/Subscription";
import categories from "~/readonlyStores/categories";
import sources from "~/readonlyStores/sources";

export function adaptSubscriptionFromApi(
  subscription: ApiSubscription
): Subscription {
  return new Subscription(
    subscription.id,
    subscription.name,
    subscription.cost,
    categories.getById(subscription.categoryId),
    subscription.period,
    dayjs(subscription.firstDate),
    subscription.active,
    subscription.sourceId === null
      ? null
      : sources.getById(subscription.sourceId)
  );
}
