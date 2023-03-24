import { type Source as ApiSource } from "@prisma/client";
import { adaptSourceFromApi } from "~/adapters/source/sourceFromApi";
import type Source from "~/models/Source";
import { type DataLoader } from "~/stores/DataLoader";
import type { Option } from "~/types/types";
import { trpc } from "~/utils/api";

class Sources implements DataLoader<ApiSource[]> {
  public dataLoaded = false;
  private sources: Source[] = [];

  async loadData() {
    return trpc.sources.getAll.query();
  }

  setDataLoaded(dataLoaded: boolean): void {
    this.dataLoaded = dataLoaded;
  }

  init(sources: ApiSource[]): void {
    this.sources = sources.map(adaptSourceFromApi);
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

const sources = new Sources();

export default sources;
