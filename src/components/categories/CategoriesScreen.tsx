import { PlusOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import {
  MaterialReactTable,
  MRT_ExpandButton,
  useMaterialReactTable,
} from "material-react-table";
import { MRT_Localization_RU } from "material-react-table/locales/ru";
import { observer } from "mobx-react";
import React, { useCallback } from "react";
import { dataStores } from "~/stores/dataStores";
import CategoryModal from "./CategoryEditModal/CategoryModal";
import categoryModalViewModel from "./CategoryEditModal/categoryModalViewModel";
import { usePersistCategoriesOrder } from "./hooks/usePersistCategoriesOrder";
import { RowActions } from "./RowActions";
import useCategoriesTableColumns from "./useCategoriesTableColumns";

const REQUIRED_CATEGORIES = ["FROM_SAVINGS", "TO_SAVINGS"];

const CategoriesScreen: React.FC = observer(function CategoriesScreen() {
  const saveName = useCallback(
    (categoryId: number, name: string) =>
      dataStores.categoriesStore.updateCategoryField(categoryId, "name", name),
    []
  );
  const columns = useCategoriesTableColumns();
  const persistExpenseCategoriesOrder = usePersistCategoriesOrder();
  const { open } = categoryModalViewModel;

  const table = useMaterialReactTable({
    editDisplayMode: "cell",
    columns,
    data: dataStores.categoriesStore.tableItems,
    enableEditing: true,
    enableGrouping: true,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enablePagination: false,
    groupedColumnMode: "remove",
    enableColumnActions: false,
    enableColumnDragging: false,
    enableRowOrdering: true,
    enableSorting: false,
    enableExpanding: false,
    enableExpandAll: false,
    initialState: {
      grouping: ["isIncome"],
      expanded: true,
      sorting: [{ id: "isIncome", desc: false }],
      density: "compact",
      columnVisibility: { isIncome: false },
    },
    muiRowDragHandleProps: ({ row, table }) => ({
      onDragEnd: () => {
        persistExpenseCategoriesOrder(table, row.original.isIncome);
      },
    }),
    enableRowActions: true,
    renderRowActions: ({ row }) => {
      if (row.getIsGrouped()) {
        return undefined;
      }
      return (
        <RowActions
          id={row.original.id}
          isIncome={row.original.isIncome}
          deletingDisabled={
            row.original.type !== null &&
            REQUIRED_CATEGORIES.includes(row.original.type)
          }
        />
      );
    },
    positionActionsColumn: "last",
    localization: MRT_Localization_RU,
    displayColumnDefOptions: {
      "mrt-row-expand": {
        header: "Полное имя",
        Cell: ({ row, table }) => {
          return (
            <div style={{ padding: "0.5rem" }}>
              <MRT_ExpandButton row={row} table={table} />
              {row.getIsGrouped()
                ? row.original.isIncome
                  ? "Доход"
                  : "Расход"
                : row.original.name}
            </div>
          );
        },
        size: 200,
        muiEditTextFieldProps: ({ row }) => ({
          onBlur: (event) => {
            const { value } = event.target;
            void saveName(row.original.id, value);
          },
        }),
      },
      "mrt-row-drag": {
        header: "",
        size: 40,
      },
    },
  });

  return (
    <>
      <Space direction="vertical">
        <Button
          onClick={() => {
            void open();
          }}
        >
          <PlusOutlined />
          Добавить
        </Button>
        <MaterialReactTable table={table} />
      </Space>
      <CategoryModal />
    </>
  );
});

export default CategoriesScreen;
