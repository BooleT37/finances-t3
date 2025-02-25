import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useCallback } from "react";
import type Category from "~/features/category/Category";
import { useGetCategoryById } from "~/features/category/facets/categoryById";
import type Subcategory from "~/features/category/Subcategory";
import { adaptCostFromApi } from "~/features/shared/adapters/adaptCostFromApi";
import { useSources } from "~/features/source/facets/allSources";
import type Source from "~/features/source/Source";
import { subscriptionQueryParams } from "../api/subscriptionsApi";
import type { ApiSubscription } from "../api/types";
import Subscription from "../Subscription";

function adaptSubscriptionFromApi(
  subscription: ApiSubscription,
  category: Category,
  subcategory: Subcategory | null,
  source: Source | null
): Subscription {
  return new Subscription(
    subscription.id,
    subscription.name,
    adaptCostFromApi(subscription.cost, category),
    category,
    subcategory,
    subscription.period,
    dayjs.utc(subscription.firstDate),
    subscription.active,
    source
  );
}

export const useSubscriptions = () => {
  const getCategoryById = useGetCategoryById();
  const { data: sources } = useSources();
  return useQuery({
    ...subscriptionQueryParams,
    select: useCallback(
      (data: ApiSubscription[]) => {
        if (!getCategoryById.loaded) {
          return;
        }
        try {
          const domainObjects = data.map((subscription) => {
            const category = getCategoryById.getCategoryById(
              subscription.categoryId
            );
            const subcategory =
              subscription.subcategoryId === null
                ? null
                : category?.subcategories.find(
                    (s) => s.id === subscription.subcategoryId
                  );
            if (subcategory === undefined) {
              throw new Error(
                `Can't load subscriptions. Can't find subcategory with id ${subscription.subcategoryId}`
              );
            }
            const source =
              subscription.sourceId === null
                ? null
                : sources?.find(
                    (source) => source.id === subscription.sourceId
                  );
            if (source === undefined) {
              throw new Error(
                `Can't load subscriptions. Can't find source with id ${subscription.sourceId}`
              );
            }
            return adaptSubscriptionFromApi(
              subscription,
              category,
              subcategory,
              source
            );
          });
          return domainObjects;
        } catch (e) {
          console.error(e);
          throw e;
        }
      },
      [getCategoryById, sources]
    ),
  });
};
