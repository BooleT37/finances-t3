import { PlusOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { MRT_Localization_RU } from "material-react-table/locales/ru";
import { observer } from "mobx-react";
import React from "react";
import { dataStores } from "~/stores/dataStores";
import { useHandleCreateSource } from "./hooks/useHandleCreateSource";
import { usePersistSourcesOrder } from "./hooks/usePersistSourcesOrder";
import { useSourcesTableColumns } from "./hooks/useSourcesTableColumns";
import { RowActions } from "./RowActions";

const SourcesScreen: React.FC = observer(function SourcesScreen() {
  const columns = useSourcesTableColumns(
    dataStores.sourcesStore.editSourceName,
    dataStores.sourcesStore.editSourceParser
  );
  const persistSourcesOrder = usePersistSourcesOrder();

  const table = useMaterialReactTable({
    editDisplayMode: "cell",
    columns,
    data: dataStores.sourcesStore.asTableItems,
    enableEditing: true,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enablePagination: false,
    enableColumnActions: false,
    enableColumnDragging: false,
    enableRowOrdering: true,
    enableSorting: false,
    enableExpanding: false,
    enableExpandAll: false,
    getRowId: ({ id }) => id.toString(),
    initialState: {
      sorting: [{ id: "isIncome", desc: false }],
      density: "compact",
      columnVisibility: { isIncome: false },
    },
    muiRowDragHandleProps: ({ table }) => ({
      onDragEnd: () => {
        persistSourcesOrder(table);
      },
    }),
    enableRowActions: true,
    renderRowActions: ({ row }) => {
      return <RowActions id={row.original.id} />;
    },
    positionActionsColumn: "last",
    localization: MRT_Localization_RU,
    displayColumnDefOptions: {
      "mrt-row-drag": {
        header: "",
        size: 40,
      },
      "mrt-row-actions": {
        header: "",
      },
    },
  });

  const handleCreateSource = useHandleCreateSource(table);

  return (
    <>
      <Space direction="vertical">
        <Button
          type="primary"
          onClick={() => {
            void handleCreateSource();
          }}
        >
          <PlusOutlined />
          Добавить источник
        </Button>
        <MaterialReactTable table={table} />
      </Space>
    </>
  );
});

export default SourcesScreen;
