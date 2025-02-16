import { isEqual } from "lodash";
import type NewSavingSpendingCategory from "./NewSavingSpendingCategory";
import SavingSpendingCategory from "./SavingSpendingCategory";

export default class SavingSpendingEditing {
  id: number;
  name: string;
  categories: (SavingSpendingCategory | NewSavingSpendingCategory)[];
  initialCategories: SavingSpendingCategory[];

  constructor(
    id: number,
    name: string,
    initialCategories: SavingSpendingCategory[],
    categories: (SavingSpendingCategory | NewSavingSpendingCategory)[]
  ) {
    this.id = id;
    this.name = name;
    this.initialCategories = initialCategories;
    this.categories = categories;
  }

  get newCategories() {
    return this.categories.filter(
      (category): category is NewSavingSpendingCategory => !("id" in category)
    );
  }

  get editedCategories() {
    return this.categories.filter(
      (category): category is SavingSpendingCategory => {
        if (!(category instanceof SavingSpendingCategory)) {
          return false;
        }
        const initialCategory = this.initialCategories.find(
          ({ id }) => category.id === id
        );
        if (!initialCategory) {
          throw new Error(
            `Can't find an initial category for category ${category.name}. Can't figure out if it was edited`
          );
        }
        return !isEqual(initialCategory, category);
      }
    );
  }

  get removedCategories(): SavingSpendingCategory[] {
    return this.initialCategories.filter(
      ({ id }) =>
        !this.categories.some(
          (c) => c instanceof SavingSpendingCategory && c.id === id
        )
    );
  }
}
