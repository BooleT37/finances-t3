import type { Option } from "~/types/types";

export default class Source {
  constructor(public readonly id: number, public readonly name: string) {}

  get asOption(): Option {
    return {
      value: this.id,
      label: this.name,
    };
  }
}
