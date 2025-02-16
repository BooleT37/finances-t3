import type { ExpensesParser } from "@prisma/client";
import type { Option } from "~/types";

export interface SourceTableItem {
  id: number;
  name: string;
  parser: ExpensesParser | null;
}

export default class Source {
  constructor(
    public readonly id: number,
    public name: string,
    public parser: ExpensesParser | null
  ) {}

  get asOption(): Option {
    return {
      value: this.id,
      label: this.name,
    };
  }

  get tableItem(): SourceTableItem {
    return {
      id: this.id,
      name: this.name,
      parser: this.parser,
    };
  }
}
