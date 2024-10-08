/**
 * This is the client-side entrypoint for your tRPC API. It is used to create the `api` object which
 * contains the Next.js App-wrapper, as well as your type-safe React Query hooks.
 *
 * We also create a few inference helpers for input and output types.
 */
import { createTRPCProxyClient, httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext, type WithTRPCConfig } from "@trpc/next";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import Decimal from "decimal.js";
import superjson from "superjson";

import { type AppRouter } from "~/server/api/root";

superjson.registerCustom<Decimal, string>(
  {
    isApplicable: (v): v is Decimal => Decimal.isDecimal(v),
    serialize: (v) => v.toJSON(),
    deserialize: (v) => new Decimal(v),
  },
  "decimal.js"
);

superjson.registerCustom<Date, string>(
  {
    isApplicable: (v): v is Date => v instanceof Date,
    serialize: (v) =>
      new Date(v.getTime() - v.getTimezoneOffset() * 60000).toISOString(),
    deserialize: (v) => new Date(v),
  },
  "date"
);

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

const config: WithTRPCConfig<AppRouter> = {
  /**
   * Links used to determine request flow from client to server.
   *
   * @see https://trpc.io/docs/links
   */
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === "development" ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    httpBatchLink({
      /**
       * Transformer used for data de-serialization from the server.
       *
       * @see https://trpc.io/docs/data-transformers
       */
      transformer: superjson,
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ],
};

/** A set of type-safe react-query hooks for your tRPC API. */
export const api = createTRPCNext<AppRouter>({
  config() {
    return config;
  },
  /**
   * Whether tRPC should await queries when server rendering pages.
   *
   * @see https://trpc.io/docs/nextjs#ssr-boolean-default-false
   */
  ssr: false,
  transformer: superjson,
});

export const trpc = createTRPCProxyClient<AppRouter>(config);

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;
