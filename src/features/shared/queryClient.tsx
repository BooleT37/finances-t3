import { QueryClient } from "@tanstack/react-query";
import { message } from "antd";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: Infinity,
    },
    mutations: {
      retry: false,
      onError: (error: unknown) => {
        // Handle different error types
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";

        message.error(errorMessage);
      },
    },
  },
});
