import type { CategoryType } from "@prisma/client";
import type { Option } from "~/types/types";
import type Subcategory from "./Subcategory";

export const TOTAL_CATEGORY_ID = -1;

// TODO this will not work for other users, need to rework
export enum PersonalExpCategoryIdsRename {
  Alexey = 0,
  Lena = 50,
}

export default class Category {
  public readonly isPersonal: boolean;
  public readonly fromSavings: boolean;
  public readonly toSavings: boolean;
  public readonly isSavings: boolean;
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly shortname: string,
    public readonly type: CategoryType | null = null,
    public readonly isIncome = false,
    public readonly isContinuous = false,
    public readonly subcategories: Subcategory[] = []
  ) {
    this.isPersonal = type === "PERSONAL_EXPENSE";
    this.fromSavings = type === "FROM_SAVINGS";
    this.toSavings = type === "TO_SAVINGS";
    this.isSavings = this.type === "FROM_SAVINGS" || this.type === "TO_SAVINGS";
  }

  get asOption(): Option {
    return {
      value: this.id,
      label: this.name,
    };
  }

  findSubcategoryById(id: number) {
    const found = this.subcategories.find((s) => s.id === id);
    if (!found) {
      throw new Error(`Can't find subcategory by id ${id}`);
    }
    return found;
  }
}
