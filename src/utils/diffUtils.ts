export function divideWithFallbackToOne(divident: number, divider: number) {
  return divider === 0 ? 1 : divident / divider;
}
