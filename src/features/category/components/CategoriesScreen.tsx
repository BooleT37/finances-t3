import { PlusOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import {
  MaterialReactTable,
  MRT_ExpandButton,
  useMaterialReactTable,
} from "material-react-table";
import { MRT_Localization_RU } from "material-react-table/locales/ru";
import React, { useCallback } from "react";
import { useUpdateCategoryField } from "~/features/category/api/categoriesApi";
import { useCategoryTableItems } from "~/features/category/facets/categoryTableItems";
import CategoryModal from "./CategoryEditModal/CategoryModal";
import {
  CategoryModalContextProvider,
  useCategoryModalContext,
} from "./CategoryEditModal/categoryModalContext";
import { NameWithOptionalIcon } from "./categoryIcons/NameWithOptionalIcon";
import { usePersistCategoriesOrder } from "./hooks/usePersistCategoriesOrder";
import { RowActions } from "./RowActions";
import useCategoriesTableColumns from "./useCategoriesTableColumns";

const REQUIRED_CATEGORIES = ["FROM_SAVINGS", "TO_SAVINGS"];

const CategoriesScreen: React.FC = () => {
  const updateCategoryField = useUpdateCategoryField();
  const saveName = useCallback(
    (categoryId: number, name: string) =>
      updateCategoryField.mutate({
        id: categoryId,
        field: "name",
        value: name,
      }),
    [updateCategoryField]
  );
  const columns = useCategoriesTableColumns();
  const persistExpenseCategoriesOrder = usePersistCategoriesOrder();
  const { open } = useCategoryModalContext();
  const categoryTableItems = useCategoryTableItems();

  const table = useMaterialReactTable({
    editDisplayMode: "cell",
    columns,
    data: categoryTableItems ?? [],
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
      density: "compact",
      columnVisibility: { isIncome: false },
    },
    state: {
      columnOrder: [
        "mrt-row-drag",
        "icon",
        "mrt-row-expand",
        "shortname",
        "mrt-row-actions",
      ],
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
        Cell: ({ row, table }) => (
          <div style={{ padding: "0.5rem" }}>
            <MRT_ExpandButton row={row} table={table} />
            {row.getIsGrouped() ? (
              row.original.isIncome ? (
                "Доход"
              ) : (
                "Расход"
              )
            ) : (
              <NameWithOptionalIcon
                name={row.original.name}
                icon={row.original.icon}
              />
            )}
          </div>
        ),
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
      "mrt-row-actions": {
        header: "",
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
};

const CategoriesScreenWithProvider = () => (
  <CategoryModalContextProvider>
    <CategoriesScreen />
  </CategoryModalContextProvider>
);

export default CategoriesScreenWithProvider;
