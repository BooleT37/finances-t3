import { type Source as ApiSource } from "@prisma/client";
import { makeAutoObservable, observable } from "mobx";
import { adaptSourceFromApi } from "~/adapters/source/sourceFromApi";
import type Source from "~/models/Source";
import { type DataLoader } from "~/stores/DataLoader";
import type { Option } from "~/types/types";
import { trpc } from "~/utils/api";

export class SourcesStore implements DataLoader<ApiSource[]> {
  public dataLoaded = false;
  public dataLoading = false;
  private sources = observable.array<Source>();

  constructor() {
    makeAutoObservable(this);
  }

  async loadData() {
    return trpc.sources.getAll.query();
  }

  setDataLoaded(dataLoaded: boolean): void {
    this.dataLoaded = dataLoaded;
  }

  setDataLoading(dataLoading: boolean): void {
    this.dataLoading = dataLoading;
  }

  init(sources: ApiSource[]): void {
    this.sources.replace(sources.map(adaptSourceFromApi));
  }

  getAll(): Source[] {
    return this.sources;
  }

  getByIdIfExists(id: number): Source | undefined {
    return this.sources.find((s) => s.id === id);
  }

  getById(id: number): Source {
    const source = this.getByIdIfExists(id);
    if (!source) {
      throw new Error(`Cannot find source with the id ${id}`);
    }
    return source;
  }

  get asOptions(): Option[] {
    return this.sources.map((s) => s.asOption);
  }
}

const sourcesStore = new SourcesStore();

export default sourcesStore;
