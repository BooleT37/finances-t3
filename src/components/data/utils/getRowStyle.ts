import { type RowClassParams, type RowStyle } from "ag-grid-enterprise";
import { action } from "mobx";
import categories from "~/readonlyStores/categories";

const getRowStyle = action((params: RowClassParams): RowStyle | undefined => {
  if (params.node.group) {
    if (categories.incomeCategoriesNames.includes(params.node.key || "")) {
      return {
        fontStyle: "italic",
      };
    }
  }
  return undefined;
});

export default getRowStyle;
