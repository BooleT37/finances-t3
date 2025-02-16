import { type ExpensesParser } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "~/utils/api";
import type Source from "../Source";

export const sourcesKeys = {
  all: ["sources"] as const,
};

export const sourcesQueryParams = {
  queryKey: sourcesKeys.all,
  queryFn: () => trpc.sources.getAll.query(),
} as const;

export const useUpdateSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (source: Source) =>
      trpc.sources.update.mutate({
        id: source.id,
        data: {
          name: source.name,
          parser: source.parser,
        },
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sourcesKeys.all });
    },
  });
};

export const useCreateSource = (getName: () => string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      trpc.sources.create.mutate({
        name: getName(),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sourcesKeys.all });
    },
  });
};

export const useDeleteSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => trpc.sources.delete.mutate({ id }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sourcesKeys.all });
    },
  });
};

export const useEditSourceName = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, id }: { name: string; id: number }) =>
      trpc.sources.update.mutate({
        data: { name },
        id,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sourcesKeys.all });
    },
  });
};

export const useEditSourceParser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      parser,
      id,
    }: {
      parser: ExpensesParser | null;
      id: number;
    }) =>
      trpc.sources.update.mutate({
        data: { parser },
        id,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sourcesKeys.all });
    },
  });
};
