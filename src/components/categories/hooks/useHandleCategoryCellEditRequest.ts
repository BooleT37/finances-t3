import { type CellEditRequestEvent } from "ag-grid-community";
import { type CategoryTableItem } from "~/models/Category";
import { dataStores } from "~/stores/dataStores";

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
    void dataStores.categoriesStore.updateCategoryField(
      event.data.id,
      field,
      newValue
    );
  };
