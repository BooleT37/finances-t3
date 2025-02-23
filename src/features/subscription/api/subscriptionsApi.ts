import type { Prisma } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "~/utils/api";
import type Subscription from "../Subscription";
import { type ApiSubscription } from "./types";

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
    onSuccess: (newSubscription) => {
      queryClient.setQueryData<ApiSubscription[]>(
        subscriptionKeys.all,
        (old) => {
          if (!old) return old;
          return [...old, newSubscription];
        }
      );
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
    mutationFn: async (id: number) => {
      await trpc.sub.delete.mutate({ id });
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: subscriptionKeys.all });

      const previousSubscriptions = queryClient.getQueryData<ApiSubscription[]>(
        subscriptionKeys.all
      );

      queryClient.setQueryData<ApiSubscription[]>(subscriptionKeys.all, (old) =>
        old?.filter((sub) => sub.id !== id)
      );

      return { previousSubscriptions };
    },
    onError: (_, __, context) => {
      if (context?.previousSubscriptions) {
        queryClient.setQueryData(
          subscriptionKeys.all,
          context.previousSubscriptions
        );
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
    },
  });
};

interface SubscriptionData {
  id: number;
  active: boolean;
  [key: string]: unknown;
}

export const useSetSubscriptionActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      trpc.sub.update.mutate({
        id,
        data: { active },
      }),
    onMutate: async ({ id, active }) => {
      await queryClient.cancelQueries({ queryKey: subscriptionKeys.all });

      const previousSubscriptions = queryClient.getQueryData<
        SubscriptionData[]
      >(subscriptionKeys.all);

      queryClient.setQueryData<SubscriptionData[]>(
        subscriptionKeys.all,
        (old) => {
          if (!old) return old;
          return old.map((sub) => (sub.id === id ? { ...sub, active } : sub));
        }
      );

      return { previousSubscriptions };
    },
    onError: (_, __, context) => {
      if (context?.previousSubscriptions) {
        queryClient.setQueryData(
          subscriptionKeys.all,
          context.previousSubscriptions
        );
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
    },
  });
};
