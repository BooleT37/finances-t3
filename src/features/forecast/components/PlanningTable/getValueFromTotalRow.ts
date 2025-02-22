import type { Row } from "@tanstack/react-table";
import { TOTAL_ROW_CATEGORY_ID } from "~/features/category/Category";
import type { ForecastTableItem } from "~/features/forecast/types";

export const getValueFromTotalRow = (
  columnId: string,
  leafRows: Row<ForecastTableItem>[]
) => {
  const row = leafRows.find(
    (row) => row.original.categoryId === TOTAL_ROW_CATEGORY_ID
  );
  if (!row) {
    console.error("Can't get value from total row", {
      reason: "Total row not found",
    });
    return;
  }
  return row.getValue(columnId);
};
