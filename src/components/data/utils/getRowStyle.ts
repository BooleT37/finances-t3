import { type RowClassParams, type RowStyle } from "ag-grid-enterprise";
import { action } from "mobx";
import { dataStores } from "~/stores/dataStores";

const getRowStyle = action((params: RowClassParams): RowStyle | undefined => {
  if (params.node.group) {
    if (
      dataStores.categoriesStore.incomeCategoriesNames.includes(
        params.node.key || ""
      )
    ) {
      return {
        fontStyle: "italic",
      };
    }
  }
  return undefined;
});

export default getRowStyle;
