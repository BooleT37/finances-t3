import { type Source as ApiSource } from "@prisma/client";
import { makeAutoObservable, observable, runInAction } from "mobx";
import { adaptSourceFromApi } from "~/adapters/source/sourceFromApi";
import type Source from "~/models/Source";
import { type SourceTableItem } from "~/models/Source";
import { type DataLoader } from "~/stores/DataLoader";
import type { Option } from "~/types/types";
import { trpc } from "~/utils/api";
import { getFirstUnusedName } from "~/utils/getFirstUnusedName";
import userSettingsStore from "./userSettingsStore";

export class SourcesStore implements DataLoader<ApiSource[]> {
  private sources = observable.array<Source>();

  constructor() {
    makeAutoObservable(this);
  }

  async loadData() {
    return trpc.sources.getAll.query();
  }

  init(sources: ApiSource[]): void {
    this.sources.replace(sources.map(adaptSourceFromApi));
  }

  getAll(): Source[] {
    const { sourcesOrder } = userSettingsStore;
    return this.sources
      .slice()
      .sort((a, b) => sourcesOrder.indexOf(a.id) - sourcesOrder.indexOf(b.id));
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
    return this.getAll().map((s) => s.asOption);
  }

  get asTableItems(): SourceTableItem[] {
    return this.getAll().map((s) => s.asTableItem);
  }

  async createSource() {
    const names = this.getAll().map((s) => s.name);
    const created = await trpc.sources.create.mutate({
      name: getFirstUnusedName(names, "Источник"),
    });
    const adapted = adaptSourceFromApi(created);
    runInAction(() => {
      this.sources.push(adapted);
    });

    return adapted;
  }

  async editSourceName(name: string, id: number) {
    const source = this.getById(id);
    await trpc.sources.update.mutate({
      data: {
        name,
      },
      id,
    });
    runInAction(() => {
      source.name = name;
    });
  }

  async deleteSource(id: number) {
    const source = this.getById(id);
    await trpc.sources.delete.mutate({
      id,
    });
    this.sources.remove(source);
  }
}

const sourcesStore = new SourcesStore();

export default sourcesStore;
