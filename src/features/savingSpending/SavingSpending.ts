import type { Option } from "~/types";
import { trpc } from "~/utils/api";
import type SavingSpendingCategory from "./SavingSpendingCategory";

export default class SavingSpending {
  id: number;
  name: string;
  completed: boolean;
  categories: SavingSpendingCategory[];

  constructor(
    id: number,
    name: string,
    completed: boolean,
    categories: SavingSpendingCategory[]
  ) {
    this.id = id;
    this.name = name;
    this.completed = completed;
    this.categories = categories;
  }

  changeName(name: string) {
    this.name = name;
  }

  editCategory(category: SavingSpendingCategory) {
    const index = this.categories.findIndex((c) => c.id === category.id);
    if (index === -1) {
      throw new Error(`Can't find category by id ${category.id}`);
    }
    this.categories[index] = category;
  }

  clone() {
    return new SavingSpending(
      this.id,
      this.name,
      this.completed,
      this.categories.slice()
    );
  }

  getCategoryById(id: number) {
    const found = this.categories.find((c) => c.id === id);
    if (!found) {
      throw new Error(`Can't find category by id ${id}`);
    }

    return found;
  }

  get asOption(): Option {
    return {
      value: this.id,
      label: this.name,
      disabled: this.completed,
    };
  }

  async toggle(completed: boolean) {
    this.completed = completed;

    await trpc.savingSpending.toggle.mutate({ id: this.id, completed });
  }
}
