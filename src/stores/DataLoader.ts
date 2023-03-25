export interface DataLoader<TData> {
  dataLoaded: boolean;
  setDataLoaded(dataLoaded: boolean): void;
  loadData(): Promise<TData | undefined>;
  init(data: TData): void;
}