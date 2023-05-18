import { PlusOutlined } from "@ant-design/icons";
import { AgGridReact } from "ag-grid-react";
import { Button, Space } from "antd";
import { observer } from "mobx-react";
import { useRef } from "react";
import { AG_GRID_LOCALE_RU } from "~/agGridLocale.ru";
import { type SourceTableItem } from "~/models/Source";
import { dataStores } from "~/stores/dataStores";
import { сolumnDefs } from "./columnDefs";
import { useHandleCreateSource } from "./hooks/useHandleCreateSource";
import { useHandleSourceCellEditRequest } from "./hooks/useHandleSourceCellEditRequest";
import { usePersistSourcesOrder } from "./hooks/usePersistSourcesOrder";

const SourcesScreen = observer(function SourcesScreen() {
  const handleCellEditRequest = useHandleSourceCellEditRequest();
  const ref = useRef<AgGridReact<SourceTableItem>>(null);

  const handleCreateCategory = useHandleCreateSource();
  const persistCategoriesOrder = usePersistSourcesOrder();

  return (
    <div className="ag-theme-alpine">
      <Space direction="vertical">
        <Button
          type="primary"
          onClick={() => {
            void handleCreateCategory(ref);
          }}
        >
          <PlusOutlined />
          Добавить источник
        </Button>
        <div style={{ width: 250 }}>
          <AgGridReact<SourceTableItem>
            ref={ref}
            columnDefs={сolumnDefs}
            rowData={dataStores.sourcesStore.asTableItems}
            readOnlyEdit
            onCellEditRequest={handleCellEditRequest}
            domLayout="autoHeight"
            groupDefaultExpanded={-1}
            localeText={AG_GRID_LOCALE_RU}
            rowDragManaged
            animateRows
            singleClickEdit
            stopEditingWhenCellsLoseFocus
            headerHeight={0}
            getRowId={({ data }) => data.id.toString()}
            onModelUpdated={({ api }) => {
              persistCategoriesOrder(api);
            }}
          />
        </div>
      </Space>
    </div>
  );
});

export default SourcesScreen;
