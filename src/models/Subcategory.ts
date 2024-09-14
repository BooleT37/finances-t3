import { makeAutoObservable } from "mobx";
import type { Option } from "~/types/types";

export default class Subcategory {
  constructor(public readonly id: number, public readonly name: string) {
    makeAutoObservable(this);
  }

  get asOption(): Option {
    return {
      value: this.id,
      label: this.name,
    };
  }
}
