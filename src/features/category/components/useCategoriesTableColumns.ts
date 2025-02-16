import { createMRTColumnHelper } from "material-react-table";
import { useMemo } from "react";
import type { CategoryTableItem } from "~/features/category/Category";

const columnHelper = createMRTColumnHelper<CategoryTableItem>();

const useCategoriesTableColumns = () =>
  useMemo(
    () => [
      columnHelper.accessor("isIncome", {
        header: "Тип",
        getGroupingValue: (row) => (row.isIncome ? "Доход" : "Расход"),
      }),
      columnHelper.accessor("shortname", {
        header: "Короткое имя",
        size: 200,
        enableEditing: false,
      }),
    ],
    []
  );

export default useCategoriesTableColumns;
