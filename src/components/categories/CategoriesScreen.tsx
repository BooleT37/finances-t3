import { PlusOutlined } from "@ant-design/icons";
import { AgGridReact } from "ag-grid-react";
import { Button, Space, Typography } from "antd";
import { observer } from "mobx-react";
import { useRef } from "react";
import { AG_GRID_LOCALE_RU } from "~/agGridLocale.ru";
import { type CategoryTableItem } from "~/models/Category";
import { dataStores } from "~/stores/dataStores";
import { categoriesColumnDefs } from "./categoriesColumnDefs";
import CategoryModal from "./CategoryEditModal/CategoryModal";
import categoryModalViewModel from "./CategoryEditModal/categoryModalViewModel";
import { useHandleCategoryCellEditRequest } from "./hooks/useHandleCategoryCellEditRequest";
import { usePersistCategoriesOrder } from "./hooks/usePersistCategoriesOrder";

const { Title } = Typography;

const CategoriesScreen = observer(function CategoriesScreen() {
  const handleCellEditRequest = useHandleCategoryCellEditRequest();
  const expensesRef = useRef<AgGridReact<CategoryTableItem>>(null);
  const incomeRef = useRef<AgGridReact<CategoryTableItem>>(null);

  const persistExpenseCategoriesOrder = usePersistCategoriesOrder(false);
  const persistIncomeCategoriesOrder = usePersistCategoriesOrder(true);
  const { open } = categoryModalViewModel;

  return (
    <div className="ag-theme-alpine">
      <Space wrap={true} size="middle" align="start">
        <Space direction="vertical">
          <Space align="baseline">
            <Title level={2}>Расходы</Title>
            <Button
              onClick={() => {
                void open(false, null);
              }}
            >
              <PlusOutlined />
              Добавить
            </Button>
          </Space>
          <div style={{ width: 502 }}>
            <AgGridReact<CategoryTableItem>
              ref={expensesRef}
              columnDefs={categoriesColumnDefs}
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
                persistExpenseCategoriesOrder(api);
              }}
            />
          </div>
        </Space>
        <Space direction="vertical">
          <Space align="baseline">
            <Title level={2}>Доходы</Title>
            <Button
              onClick={() => {
                void open(true, null);
              }}
            >
              <PlusOutlined />
              Добавить
            </Button>
          </Space>
          <div style={{ width: 502 }}>
            <AgGridReact<CategoryTableItem>
              ref={incomeRef}
              columnDefs={categoriesColumnDefs}
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
                persistIncomeCategoriesOrder(api);
              }}
            />
          </div>
        </Space>
      </Space>
      <CategoryModal />
    </div>
  );
});

export default CategoriesScreen;
