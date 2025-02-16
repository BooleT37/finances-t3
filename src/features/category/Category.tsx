import type { CategoryType } from "@prisma/client";
import { type CategoryTreeSelectOption } from "~/features/category/components/CategorySubcategorySelect";
import { NameWithOptionalIcon } from "~/features/category/components/categoryIcons/NameWithOptionalIcon";
import type { Option } from "~/types";
import type Subcategory from "./Subcategory";

export const TOTAL_ROW_CATEGORY_ID = -1;

export enum PersonalExpCategoryIdsRename {
  Alexey = 0,
  Lena = 50,
}

export interface OptionWithText extends Option {
  text: string;
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
  ) {}

  get asOption(): OptionWithText {
    return {
      value: this.id,
      label: <NameWithOptionalIcon name={this.name} icon={this.icon} />,
      text: this.name,
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
    return this.subcategories.find((s) => s.id === id);
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
