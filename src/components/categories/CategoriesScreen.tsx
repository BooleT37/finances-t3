import { PlusOutlined } from "@ant-design/icons";
import { AgGridReact } from "ag-grid-react";
import { Button, Space, Typography } from "antd";
import { observer } from "mobx-react";
import { useRef } from "react";
import { AG_GRID_LOCALE_RU } from "~/agGridLocale.ru";
import { type CategoryTableItem } from "~/models/Category";
import { dataStores } from "~/stores/dataStores";
import { getColumnDefs } from "./columnDefs";
import { useHandleCategoryCellEditRequest } from "./hooks/useHandleCategoryCellEditRequest";
import { useHandleCreateCategory } from "./hooks/useHandleCreateCategory";
import { usePersistCategoriesOrder } from "./hooks/usePersistCategoriesOrder";

const { Title } = Typography;

const CategoriesScreen = observer(function CategoriesScreen() {
  const handleCellEditRequest = useHandleCategoryCellEditRequest();
  const expensesRef = useRef<AgGridReact<CategoryTableItem>>(null);
  const incomeRef = useRef<AgGridReact<CategoryTableItem>>(null);

  const handleCreateCategory = useHandleCreateCategory();
  const persistCategoriesOrder = usePersistCategoriesOrder();

  return (
    <div className="ag-theme-alpine">
      <Space direction="vertical" size="middle">
        <Space align="baseline">
          <Title level={2}>Расходы</Title>
          <Button
            onClick={() => {
              void handleCreateCategory(false, expensesRef);
            }}
          >
            <PlusOutlined />
            Добавить расход
          </Button>
        </Space>
        <div style={{ width: 1060 }}>
          <AgGridReact<CategoryTableItem>
            ref={expensesRef}
            columnDefs={getColumnDefs(false)}
            rowData={dataStores.categoriesStore.tableExpenseItems}
            readOnlyEdit
            onCellEditRequest={handleCellEditRequest}
            domLayout="autoHeight"
            groupDefaultExpanded={-1}
            localeText={AG_GRID_LOCALE_RU}
            rowDragManaged
            animateRows
            singleClickEdit
            stopEditingWhenCellsLoseFocus
            getRowId={({ data }) => data.id.toString()}
            onModelUpdated={({ api }) => {
              persistCategoriesOrder(false, api);
            }}
          />
        </div>
        <Space align="baseline">
          <Title level={2}>Доходы</Title>
          <Button
            onClick={() => {
              void handleCreateCategory(true, incomeRef);
            }}
          >
            <PlusOutlined />
            Добавить доход
          </Button>
        </Space>
        <div style={{ width: 860 }}>
          <AgGridReact<CategoryTableItem>
            ref={incomeRef}
            columnDefs={getColumnDefs(true)}
            rowData={dataStores.categoriesStore.tableIncomeItems}
            readOnlyEdit
            onCellEditRequest={handleCellEditRequest}
            domLayout="autoHeight"
            groupDefaultExpanded={-1}
            localeText={AG_GRID_LOCALE_RU}
            rowDragManaged
            animateRows
            getRowId={({ data }) => data.id.toString()}
            singleClickEdit
            stopEditingWhenCellsLoseFocus
            onModelUpdated={({ api }) => {
              persistCategoriesOrder(true, api);
            }}
          />
        </div>
      </Space>
    </div>
  );
});

export default CategoriesScreen;
