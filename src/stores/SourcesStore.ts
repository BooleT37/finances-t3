import { type Source as ApiSource, type ExpensesParser } from "@prisma/client";
import { makeAutoObservable, observable, runInAction } from "mobx";
import { adaptSourceFromApi } from "~/adapters/source/sourceFromApi";
import type Source from "~/models/Source";
import { type SourceTableItem } from "~/models/Source";
import type { Option } from "~/types/types";
import { trpc } from "~/utils/api";
import { getFirstUnusedName } from "~/utils/getFirstUnusedName";
import { type DataLoader } from "./dataStores";
import { dataStores } from "./dataStores/DataStores";

export default class SourcesStore implements DataLoader<ApiSource[]> {
  private sources = observable.array<Source>();
  inited = false;

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  async loadData() {
    return trpc.sources.getAll.query();
  }

  init(sources: ApiSource[]): void {
    this.sources.replace(sources.map(adaptSourceFromApi));
    this.inited = true;
  }

  getAll(): Source[] {
    const { sourcesOrder } = dataStores.userSettingsStore;
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

  async editSourceParser(parser: ExpensesParser | null, id: number) {
    const source = this.getById(id);
    await trpc.sources.update.mutate({
      data: {
        parser,
      },
      id,
    });
    runInAction(() => {
      source.parser = parser;
    });
  }

  async deleteSource(id: number) {
    const source = this.getById(id);
    await trpc.sources.delete.mutate({
      id,
    });
    runInAction(() => {
      this.sources.remove(source);
    });
  }
}
