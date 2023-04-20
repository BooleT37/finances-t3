export interface DataLoader<TData = unknown> {
  loadData(): Promise<TData | undefined>;
  init(data: TData): void;
}
