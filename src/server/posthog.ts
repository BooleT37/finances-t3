import { PostHog } from "posthog-node";

const posthog = process.env.POSTHOG_API_KEY
  ? new PostHog(process.env.POSTHOG_API_KEY, {
      host: process.env.POSTHOG_HOST ?? "https://app.posthog.com",
      flushAt: 1, // Flush after each event during development
      flushInterval: 3000, // Flush every 3 seconds in production
    })
  : null;

export { posthog };
