import type { Subscription as ApiSubscription } from "@prisma/client";
import dayjs from "dayjs";
import Subscription from "~/models/Subscription";
import { dataStores } from "~/stores/dataStores";

export function adaptSubscriptionFromApi(
  subscription: ApiSubscription
): Subscription {
  return new Subscription(
    subscription.id,
    subscription.name,
    subscription.cost,
    dataStores.categoriesStore.getById(subscription.categoryId),
    subscription.subcategoryId === null
      ? null
      : dataStores.categoriesStore.getSubcategoryById(
          subscription.categoryId,
          subscription.subcategoryId
        ),
    subscription.period,
    dayjs.utc(subscription.firstDate),
    subscription.active,
    subscription.sourceId === null
      ? null
      : dataStores.sourcesStore.getById(subscription.sourceId)
  );
}
