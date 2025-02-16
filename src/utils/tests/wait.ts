/**
 * Utility function to wait for a specified amount of time.
 * Useful in tests when we need to wait for UI updates.
 */
export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
