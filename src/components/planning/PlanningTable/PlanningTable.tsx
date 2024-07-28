import type Decimal from "decimal.js";
import {
  MaterialReactTable,
  MRT_ExpandButton,
  useMaterialReactTable,
} from "material-react-table";
import { MRT_Localization_RU } from "material-react-table/locales/ru";
import { observer } from "mobx-react";
import React, { useCallback } from "react";
import { dataStores } from "~/stores/dataStores";
import type { ForecastTableItemGroup } from "~/stores/ForecastStore/types";
import usePlanningTableColumns from "./usePlanningTableColumns";

const GROUP_TRANSLATIONS: Record<ForecastTableItemGroup, string> = {
  expense: "Расходы",
  income: "Доходы",
  personal: "Личные",
  savings: "Сбережения",
};

interface Props {
  month: number;
  year: number;
  // tableInstanceRef: React.MutableRefObject<MRT_TableInstance<TableData> | null>;
}

const PlanningTable: React.FC<Props> = observer(function PlanningTable({
  month,
  year,
}) {
  const saveSum = useCallback(
    async (categoryId: number, sum: Decimal) => {
      await dataStores.forecastStore.changeForecastSum(
        dataStores.categoriesStore.getById(categoryId),
        month,
        year,
        sum
      );
    },
    [month, year]
  );
  const saveComment = useCallback(
    async (categoryId: number, comment: string) => {
      await dataStores.forecastStore.changeForecastComment(
        dataStores.categoriesStore.getById(categoryId),
        month,
        year,
        comment
      );
    },
    [month, year]
  );
  const transferPersonalExpense = useCallback(
    async (categoryId: number) => {
      await dataStores.forecastStore.transferPersonalExpense(
        categoryId,
        month,
        year
      );
    },
    [month, year]
  );
  const columns = usePlanningTableColumns({
    saveSum,
    saveComment,
    transferPersonalExpense,
  });
  const data = dataStores.forecastStore.tableData({
    month,
    year,
  });
  const table = useMaterialReactTable({
    editDisplayMode: "cell",
    columns,
    data,
    enableEditing: true,
    enableGrouping: true,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enableColumnDragging: false,
    enablePagination: false,
    groupedColumnMode: "remove",
    enableColumnActions: false,
    initialState: {
      grouping: ["group"],
      expanded: true,
      sorting: [{ id: "category", desc: false }],
      density: "compact",
      columnVisibility: { group: false, category: false },
    },
    displayColumnDefOptions: {
      "mrt-row-expand": {
        Header: "Категория",
        Cell: ({ row, table }) => {
          return (
            <div style={{ lineHeight: "40px" }}>
              <MRT_ExpandButton row={row} table={table} />
              {row.getIsGrouped()
                ? GROUP_TRANSLATIONS[row.original.group]
                : row.original.categoryShortname}
            </div>
          );
        },
        size: 200,
      },
    },
    localization: MRT_Localization_RU,
  });

  // const expandCategory = React.useCallback((category: string) => {
  //   setTimeout(() => {
  //     if (!gridRef.current) {
  //       return;
  //     }
  //     gridRef.current.api.forEachNode((node) => {
  //       if (node.key === category) {
  //         node.setExpanded(true);
  //       }
  //     });
  //   }, 0);
  // }, []);

  return <MaterialReactTable table={table} />;
});

export default PlanningTable;
