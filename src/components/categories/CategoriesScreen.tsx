import { AgGridReact } from "ag-grid-react";
import { Space, Typography } from "antd";
import { observer } from "mobx-react";
import { AG_GRID_LOCALE_RU } from "~/agGridLocale.ru";
import { type CategoryTableItem } from "~/models/Category";
import categoriesStore from "~/stores/categoriesStore";
import { columnDefs } from "./columnDefs";
import { useHandleCategoryCellEditRequest } from "./useHandleCategoryCellEditRequest";

const { Title } = Typography;

const CategoriesScreen = observer(function CategoriesScreen() {
  const handleCellEditRequest = useHandleCategoryCellEditRequest();
  return (
    <div className="ag-theme-alpine">
      <Space direction="vertical" size="middle">
        <Title level={2}>Расходы</Title>
        <div style={{ width: 1010 }}>
          <AgGridReact<CategoryTableItem>
            columnDefs={columnDefs}
            rowData={categoriesStore.tableExpenseItems}
            readOnlyEdit
            onCellEditRequest={handleCellEditRequest}
            domLayout="autoHeight"
            groupDefaultExpanded={-1}
            localeText={AG_GRID_LOCALE_RU}
          />
        </div>
        <Title level={2}>Доходы</Title>
        <div style={{ width: 1010 }}>
          <AgGridReact<CategoryTableItem>
            columnDefs={columnDefs}
            rowData={categoriesStore.tableIncomeItems}
            readOnlyEdit
            onCellEditRequest={handleCellEditRequest}
            domLayout="autoHeight"
            groupDefaultExpanded={-1}
            localeText={AG_GRID_LOCALE_RU}
          />
        </div>
      </Space>
    </div>
  );
});

export default CategoriesScreen;
