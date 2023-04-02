import { type Prisma } from "@prisma/client";
import type Subscription from "~/models/Subscription";

export function adaptSubscriptionToCreateInput(
  subscription: Subscription
): Prisma.SubscriptionCreateInput {
  return {
    name: subscription.name,
    cost: subscription.cost,
    category: { connect: { id: subscription.category.id } },
    period: subscription.period,
    firstDate: subscription.firstDate.toDate(),
    active: subscription.active,
    source:
      subscription.source?.id === undefined
        ? undefined
        : { connect: { id: subscription.source?.id } },
  };
}

export function adaptSubscriptionToUpdateInput(
  subscription: Subscription
): Prisma.SubscriptionUpdateInput {
  return {
    name: subscription.name,
    cost: subscription.cost,
    category: {
      connect: {
        id: subscription.category.id,
      },
    },
    period: subscription.period,
    firstDate: subscription.firstDate.toDate(),
    active: subscription.active,
    source:
      subscription.source?.id === undefined
        ? undefined
        : { connect: { id: subscription.source?.id } },
  };
}
