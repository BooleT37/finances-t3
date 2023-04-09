import { type Category as CategoryFromApi } from "@prisma/client";
import { type CellEditRequestEvent } from "ag-grid-community";
import type Category from "~/models/Category";
import { CategoryTableItem } from "~/models/Category";
import categoriesStore from "~/stores/categoriesStore";

export const useHandleCategoryCellEditRequest =
  () => (event: CellEditRequestEvent<CategoryTableItem>) => {
    const field = event.colDef.field as keyof CategoryTableItem | undefined;
    if (field === undefined) {
      return;
    }
    const newValue = event.newValue as CategoryTableItem[typeof field];
    if (newValue === undefined) {
      return;
    }
    void categoriesStore.updateCategoryField(event.data.id, field, newValue);
  };
