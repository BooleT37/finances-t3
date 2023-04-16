import type { Subscription as ApiSubscription } from "@prisma/client";
import dayjs from "dayjs";
import Subscription from "~/models/Subscription";
import categoriesStore from "~/stores/categoriesStore";
import sourcesStore from "~/stores/sourcesStore";

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
      : sourcesStore.getById(subscription.sourceId)
  );
}
