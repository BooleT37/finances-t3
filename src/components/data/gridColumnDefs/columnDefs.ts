import type { GridOptions, ICellRendererParams } from "ag-grid-community";
import {
  DeleteHeaderIcon,
  EditHeaderIcon,
} from "~/components/shared/headerIcons";
import { type TableData } from "~/models/Expense";
import EditButtonRenderer from "../buttonRenderers/EditButtonRenderer";
import RemoveButtonRenderer from "../buttonRenderers/RemoveButtonRenderer";
import { type DataTableContext } from "../DataScreen";
import CostCellRenderer from "./CostCellRenderer";
import { costAggFunc } from "./utils";
import { sortAllCategoriesByName } from "./utils/sortAllCategoriesByName";

const columnDefs: GridOptions["columnDefs"] = [
  {
    field: "cost",
    width: 150,
    headerName: "Сумма",
    aggFunc: costAggFunc,
    cellRenderer: CostCellRenderer,
  },
  { field: "date", width: 130, headerName: "Дата" },
  {
    field: "name",
    width: 200,
    headerName: "Имя",
    hide: true,
    resizable: true,
    tooltipField: "name",
  },
  {
    field: "category",
    rowGroup: true,
    hide: true,
    headerName: "Категория",
    sort: "asc",
    comparator: (_categoryA, _categoryB, nodeA, nodeB) =>
      nodeA.group &&
      nodeA.key === "category" &&
      nodeB.group &&
      nodeB.key === "category"
        ? sortAllCategoriesByName(nodeA.key ?? "", nodeB.key ?? "")
        : 0,
  },
  {
    field: "subcategory",
    rowGroup: true,
    hide: true,
    headerName: "Подкатегория",
  },
  {
    field: "edit",
    headerName: "",
    headerComponent: EditHeaderIcon,
    cellRenderer: EditButtonRenderer,
    width: 50,
    cellStyle: {
      paddingLeft: 5,
      paddingRight: 0,
    },
  },
  {
    field: "remove",
    headerName: "",
    headerComponent: DeleteHeaderIcon,
    cellRendererSelector: (params: ICellRendererParams<TableData>) => {
      // if it's a group row or an upcoming subscription
      if (!params.data || params.data.isUpcomingSubscription) {
        return;
      }
      return {
        component: RemoveButtonRenderer,
        params: {
          id: params.data.id,
          onClick: () => {
            if (params.data) {
              (params.context as DataTableContext).expandCategory(
                params.data.category
              );
            }
          },
        },
      };
    },
    width: 50,
    cellStyle: {
      paddingLeft: 5,
      paddingRight: 0,
    },
  },
];

export default columnDefs;
