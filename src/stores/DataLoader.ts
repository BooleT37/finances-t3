export interface DataLoader<TData = unknown> {
  dataLoaded: boolean;
  dataLoading: boolean;
  setDataLoaded(dataLoaded: boolean): void;
  setDataLoading(dataLoading: boolean): void;
  loadData(): Promise<TData | undefined>;
  init(data: TData): void;
}
