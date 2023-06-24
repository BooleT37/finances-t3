import { makeAutoObservable } from "mobx";
import type Category from "~/models/Category";
import { dataStores } from "~/stores/dataStores";

class CategoryModalViewModel {
  visible = false;
  categoryId: number | null = null;
  isIncome = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get currentCategory(): Category | undefined {
    return dataStores.categoriesStore.categories.find(
      ({ id }) => this.categoryId === id
    );
  }

  get isNewCategory(): boolean {
    return this.currentCategory === undefined;
  }

  open(isIncome: boolean, expenseId: number | null): void {
    this.isIncome = isIncome;
    this.categoryId = expenseId;
    this.visible = true;
  }

  close(): void {
    this.categoryId = null;
    this.visible = false;
    this.isIncome = false;
  }
}

const categoryModalViewModel = new CategoryModalViewModel();

export default categoryModalViewModel;
