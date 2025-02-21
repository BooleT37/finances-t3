import type { Prisma } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "~/utils/api";
import type Subscription from "../Subscription";

export const subscriptionKeys = {
  all: ["subscriptions"] as const,
};

export const subscriptionQueryParams = {
  queryKey: subscriptionKeys.all,
  queryFn: () => trpc.sub.getAll.query(),
} as const;

function adaptSubscriptionToCreateInput(
  subscription: Subscription
): Prisma.SubscriptionCreateInput {
  return {
    name: subscription.name,
    cost: subscription.cost.abs(),
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

export const useAddSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (subscription: Subscription) => {
      subscription.active = true;
      return trpc.sub.create.mutate(
        adaptSubscriptionToCreateInput(subscription)
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
    },
  });
};

function adaptSubscriptionToUpdateInput(
  subscription: Subscription
): Prisma.SubscriptionUpdateInput {
  return {
    name: subscription.name,
    cost: subscription.cost.abs(),
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

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscription: Subscription) =>
      trpc.sub.update.mutate({
        id: subscription.id,
        data: adaptSubscriptionToUpdateInput(subscription),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
    },
  });
};

export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => trpc.sub.delete.mutate({ id }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
    },
  });
};
