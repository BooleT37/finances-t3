import type { CategoryType } from "@prisma/client";
import { makeAutoObservable } from "mobx";
import { type CategoryTreeSelectOption } from "~/components/data/ExpenseModal/ComponentsModal/CategorySubcategorySelect";
import type { Option } from "~/types/types";
import type Subcategory from "./Subcategory";

export const TOTAL_ROW_CATEGORY_ID = -1;

// TODO this will not work for other users, need to rework
export enum PersonalExpCategoryIdsRename {
  Alexey = 0,
  Lena = 50,
}

export interface CategoryTableItem {
  id: number;
  name: string;
  shortname: string;
  icon: string | null;
  type: CategoryType | null;
  isIncome: boolean;
  isContinuous: boolean;
}
export default class Category {
  constructor(
    public id: number,
    public name: string,
    public shortname: string,
    public icon: string | null = null,
    public type: CategoryType | null = null,
    public isIncome = false,
    public isContinuous = false,
    public subcategories: Subcategory[] = []
  ) {
    makeAutoObservable(this);
  }

  get asOption(): Option {
    return {
      value: this.id,
      label: this.name,
    };
  }

  get asTreeOption(): CategoryTreeSelectOption {
    return {
      value: `${this.id}`,
      displayedText: this.name,
      label: this.name,
      ...(this.subcategories.length > 0
        ? {
            children: this.subcategories.map((subcategory) => ({
              label: subcategory.name,
              displayedText: `${this.name} - ${subcategory.name}`,
              value: `${this.id}-${subcategory.id}`,
            })),
          }
        : {}),
    };
  }

  get isPersonal() {
    return this.type === "PERSONAL_EXPENSE";
  }

  get fromSavings() {
    return this.type === "FROM_SAVINGS";
  }

  get toSavings() {
    return this.type === "TO_SAVINGS";
  }

  get isSavings() {
    return this.type === "FROM_SAVINGS" || this.type === "TO_SAVINGS";
  }

  findSubcategoryById(id: number) {
    const found = this.subcategories.find((s) => s.id === id);
    if (!found) {
      throw new Error(`Can't find subcategory by id ${id}`);
    }
    return found;
  }

  get tableItem(): CategoryTableItem {
    return {
      id: this.id,
      name: this.name,
      shortname: this.shortname,
      icon: this.icon,
      type: this.type,
      isIncome: this.isIncome,
      isContinuous: this.isContinuous,
    };
  }

  update(fields: Partial<Category>) {
    if (fields.name !== undefined) {
      this.name = fields.name;
    }
    if (fields.isIncome !== undefined) {
      this.isIncome = fields.isIncome;
    }
    if (fields.isContinuous !== undefined) {
      this.isContinuous = fields.isContinuous;
    }
    if (fields.shortname !== undefined) {
      this.shortname = fields.shortname;
    }
    if (fields.icon !== undefined) {
      this.icon = fields.icon;
    }
    if (fields.type !== undefined) {
      this.type = fields.type;
    }
    if (fields.subcategories !== undefined) {
      this.subcategories = fields.subcategories;
    }
  }
}
