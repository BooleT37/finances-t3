import { type ColDef, type ColGroupDef } from "ag-grid-community";
import { type ForecastTableItem } from "~/stores/forecastStore/types";
import columnDefs from "./columnDefs";
import TransferPeButtonRenderer from "./TransferPeButtonRenderer";

const personalExpensesColumnDefs: (
  | ColDef<ForecastTableItem>
  | ColGroupDef<ForecastTableItem>
)[] = columnDefs.concat({
  field: "actions",
  width: 70,
  headerName: "",
  cellRenderer: TransferPeButtonRenderer,
});

export default personalExpensesColumnDefs;
