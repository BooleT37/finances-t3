import { makeAutoObservable } from "mobx";
import type { Option } from "~/types/types";

export interface SourceTableItem {
  id: number;
  name: string;
}

export default class Source {
  constructor(public readonly id: number, public name: string) {
    makeAutoObservable(this);
  }

  get asOption(): Option {
    return {
      value: this.id,
      label: this.name,
    };
  }

  get asTableItem(): SourceTableItem {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
