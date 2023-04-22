import type { ColDef, IRowNode } from "ag-grid-community";
import { makeAutoObservable } from "mobx";
import { sortAllCategories } from "~/stores/categoriesOrder";
import { type ForecastTableItem } from "~/stores/forecastStore/types";
import userSettingsStore from "~/stores/userSettingsStore";

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
          userSettingsStore.expenseCategoriesOrder,
          userSettingsStore.incomeCategoriesOrder
        );
}

export const planningScreenViewModel = new PlanningScreenViewModel();
