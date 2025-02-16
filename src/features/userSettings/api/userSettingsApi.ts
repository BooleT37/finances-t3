import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type inferRouterOutputs } from "@trpc/server";
import type Decimal from "decimal.js";
import { isEqual } from "lodash";
import { useMemo } from "react";
import { type AppRouter } from "~/server/api/root";
import { trpc } from "~/utils/api";
import { getToday } from "~/utils/today";
import { useUserSettings } from "../facets/allUserSettings";

export type UserSettings = inferRouterOutputs<AppRouter>["userSettings"]["get"];

export const userSettingsKeys = {
  all: ["userSettings"] as const,
};

export const userSettingsQueryParams = {
  queryKey: userSettingsKeys.all,
  queryFn: () => trpc.userSettings.get.query(),
} as const;

export const useUpdatePePerMonth = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sum: Decimal) =>
      trpc.userSettings.update.mutate({ pePerMonth: sum }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userSettingsKeys.all });
    },
  });
};

export const useUpdateSavings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sum: Decimal) =>
      trpc.userSettings.update.mutate({
        savings: sum,
        savingsDate: getToday().toDate(),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userSettingsKeys.all });
    },
  });
};

export const useRemoveSavings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      trpc.userSettings.update.mutate({
        savings: null,
        savingsDate: null,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userSettingsKeys.all });
    },
  });
};

export const usePersistIncomeCategoryOrder = () => {
  const userSettings = useUserSettings();
  const currentOrder = useMemo(
    () => userSettings.data?.incomeCategoriesOrder,
    [userSettings.data?.incomeCategoriesOrder]
  );
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order: number[]) => {
      if (isEqual(order, currentOrder)) {
        return Promise.resolve();
      }
      return trpc.userSettings.update.mutate({
        incomeCategoriesOrder: order,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userSettingsKeys.all });
    },
  });
};

export const usePersistExpenseCategoryOrder = () => {
  const userSettings = useUserSettings();
  const currentOrder = useMemo(
    () => userSettings.data?.expenseCategoriesOrder,
    [userSettings.data?.expenseCategoriesOrder]
  );
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order: number[]) => {
      if (isEqual(order, currentOrder)) {
        return Promise.resolve();
      }
      return trpc.userSettings.update.mutate({
        expenseCategoriesOrder: order,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userSettingsKeys.all });
    },
  });
};

export const usePersistSourcesOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      order,
      currentOrder,
    }: {
      order: number[];
      currentOrder: number[];
    }) => {
      if (isEqual(order, currentOrder)) {
        return Promise.resolve();
      }
      return trpc.userSettings.update.mutate({
        sourcesOrder: order,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userSettingsKeys.all });
    },
  });
};
