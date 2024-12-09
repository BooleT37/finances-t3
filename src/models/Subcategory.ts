import { makeAutoObservable } from "mobx";
import type { OptionWithText } from "./Category";

export default class Subcategory {
  constructor(public readonly id: number, public readonly name: string) {
    makeAutoObservable(this);
  }

  get asOption(): OptionWithText {
    return {
      value: this.id,
      label: this.name,
      text: this.name,
    };
  }
}
