import { type inferRouterOutputs } from "@trpc/server";
import { makeAutoObservable, observable } from "mobx";
import { adaptCategoryFromApi } from "~/adapters/category/categoryFromApi";
import type Category from "~/models/Category";
import { type CategoryTableItem } from "~/models/Category";
import { type AppRouter } from "~/server/api/root";
import { trpc } from "~/utils/api";
import { sortCategories } from "./categoriesOrder";
import { type DataLoader } from "./dataStores";
import { dataStores } from "./dataStores/DataStores";

export default class CategoriesStore
  implements DataLoader<inferRouterOutputs<AppRouter>["categories"]["getAll"]>
{
  categories = observable.array<Category>();
  inited = false;

  constructor() {
    makeAutoObservable(this);
  }

  async loadData() {
    return trpc.categories.getAll.query();
  }

  init(categories: inferRouterOutputs<AppRouter>["categories"]["getAll"]) {
    this.categories.replace(categories.map(adaptCategoryFromApi));
    this.inited = true;
  }

  getByNameIfExists(name: string): Category | undefined {
    return this.categories.find((category) => category.name === name);
  }

  getByName(name: string): Category {
    const category = this.getByNameIfExists(name);
    if (!category) {
      throw new Error(`Cannot find category with the name ${name}`);
    }
    return category;
  }

  getByIdIfExists(id: number): Category | undefined {
    return this.categories.find((category) => category.id === id);
  }

  getById(id: number): Category {
    const category = this.getByIdIfExists(id);
    if (!category) {
      throw new Error(`Cannot find category with id ${id}`);
    }
    return category;
  }

  get expenseCategories() {
    return this.categories
      .filter((c) => !c.isIncome)
      .sort((c1, c2) =>
        sortCategories(
          c1.id,
          c2.id,
          dataStores.userSettingsStore.expenseCategoriesOrder
        )
      );
  }

  get incomeCategories() {
    return this.categories
      .filter((c) => c.isIncome)
      .sort((c1, c2) =>
        sortCategories(
          c1.id,
          c2.id,
          dataStores.userSettingsStore.incomeCategoriesOrder
        )
      );
  }

  get personalExpensesCategories() {
    return this.expenseCategories.filter((c) => c.isPersonal);
  }

  get generalExpenseCategories() {
    return this.expenseCategories.filter((c) => !c.isPersonal && !c.isSavings);
  }

  get fromSavingsCategory() {
    const found = this.categories.find((c) => c.fromSavings);
    if (found === undefined) {
      throw new Error('Ни одна категория не помечена как "From savings"!');
    }
    return found;
  }

  get toSavingsCategory() {
    const found = this.categories.find((c) => c.toSavings);
    if (found === undefined) {
      throw new Error('Ни одна категория не помечена как "To savings"!');
    }
    return found;
  }

  get savingsCategories() {
    return this.expenseCategories.filter((c) => c.isSavings);
  }

  get incomeCategoriesNames() {
    return this.incomeCategories.map((c) => c.name);
  }

  get options() {
    return this.categories.map((c) => c.asOption);
  }

  get expenseOptions() {
    return this.expenseCategories.map((c) => c.asOption);
  }

  get incomeOptions() {
    return this.incomeCategories.map((c) => c.asOption);
  }

  get tableIncomeItems() {
    return this.incomeCategories.map((c) => c.tableItem);
  }

  get tableExpenseItems() {
    return this.expenseCategories.map((c) => c.tableItem);
  }

  async updateCategory(category: Category) {
    await trpc.categories.update.mutate({
      data: {
        name: category.name,
        shortname: category.shortname,
        type: category.type,
        isContinuous: category.isContinuous,
        isIncome: category.isIncome,
      },
      id: category.id,
    });
    this.getById(category.id).update(category);
  }

  async updateCategoryField<Field extends keyof CategoryTableItem>(
    id: number,
    field: Field,
    value: CategoryTableItem[Field]
  ) {
    const category = this.getById(id);
    await trpc.categories.update.mutate({
      data: {
        [field]: value,
      },
      id,
    });
    category.update({ [field]: value });
  }

  async createCategory(category: Category) {
    const created = await trpc.categories.create.mutate({
      name: category.name,
      shortname: category.shortname,
      isContinuous: category.isContinuous,
      isIncome: category.isIncome,
      type: category.type,
    });
    const adaptedCategory = adaptCategoryFromApi(created);
    this.categories.push(adaptedCategory);
    return adaptedCategory;
  }

  async deleteCategory(id: number) {
    await trpc.categories.delete.mutate({ id });
    this.categories.remove(this.getById(id));
  }
}
