import { AgGridReact } from "ag-grid-react";
import { observer } from "mobx-react";
import { AG_GRID_LOCALE_RU } from "~/agGridLocale.ru";
import { type CategoryTableItem } from "~/models/Category";
import categoriesStore from "~/stores/categoriesStore";
import { columnDefs } from "./columnDefs";
import { useHandleCategoryCellEditRequest } from "./useHandleCategoryCellEditRequest";

const CategoriesScreen = observer(function CategoriesScreen() {
  const handleCellEditRequest = useHandleCategoryCellEditRequest();
  return (
    <div className="ag-theme-alpine" style={{ width: 800 }}>
      <AgGridReact<CategoryTableItem>
        columnDefs={columnDefs}
        rowData={categoriesStore.tableItems}
        readOnlyEdit
        onCellEditRequest={handleCellEditRequest}
        domLayout="autoHeight"
        groupDefaultExpanded={-1}
        localeText={AG_GRID_LOCALE_RU}
        groupDisplayType="groupRows"
      />
    </div>
  );
});

export default CategoriesScreen;
