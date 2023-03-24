export function connectIfExists<T extends { id: number }>(object: T | null) {
  return object ? { connect: { id: object.id } } : undefined;
}
