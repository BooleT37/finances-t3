import type { IRowNode } from "ag-grid-community";
import { makeAutoObservable } from "mobx";
import { sortAllCategories } from "~/stores/categoriesOrder";
import { dataStores } from "~/stores/dataStores";
import { type ForecastTableItem } from "~/stores/ForecastStore/types";

class PlanningScreenViewModel {
  constructor() {
    makeAutoObservable(this);
  }

  compareCategories = (
    categoryA: string,
    nodeA: IRowNode<ForecastTableItem>,
    nodeB: IRowNode<ForecastTableItem>
  ) =>
    categoryA === "Всего" || !nodeA.data || !nodeB.data
      ? 1
      : sortAllCategories(
          nodeA.data?.categoryId,
          nodeB.data?.categoryId,
          dataStores.userSettingsStore.expenseCategoriesOrder,
          dataStores.userSettingsStore.incomeCategoriesOrder
        );
}

export const planningScreenViewModel = new PlanningScreenViewModel();
