export interface DataLoader<TData> {
  loadData(): Promise<TData | undefined>;

  init(data: TData): void;
}
