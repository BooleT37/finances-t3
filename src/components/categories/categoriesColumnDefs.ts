import { type ColDef, type ICellRendererParams } from "ag-grid-community";
import { type CategoryTableItem } from "~/models/Category";
import { DeleteHeaderIcon, EditHeaderIcon } from "../shared/headerIcons";
import EditButtonRenderer from "./EditButtonRenderer";
import RemoveButtonRenderer from "./RemoveButtonRenderer";

const REQUIRED_CATEGORIES = ["FROM_SAVINGS", "TO_SAVINGS"];

export const categoriesColumnDefs: ColDef<CategoryTableItem>[] = [
  {
    field: "name",
    headerName: "Имя",
    resizable: true,
    editable: true,
    rowDrag: true,
  },
  {
    field: "shortname",
    headerName: "Короткое имя",
    editable: true,
  },
  {
    field: "edit",
    headerName: "",
    headerComponent: EditHeaderIcon,
    cellRendererSelector: (params: ICellRendererParams<CategoryTableItem>) => {
      // if it's a group row or an upcoming subscription
      if (!params.data) {
        return;
      }
      return {
        component: EditButtonRenderer,
        params: {
          id: params.data.id,
          isIncome: params.data.isIncome,
        },
      };
    },
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
    cellRendererSelector: (params: ICellRendererParams<CategoryTableItem>) => {
      // if it's a group row or an upcoming subscription
      if (!params.data) {
        return;
      }
      return {
        component: RemoveButtonRenderer,
        params: {
          id: params.data.id,
          disabled:
            params.data?.type !== null &&
            REQUIRED_CATEGORIES.includes(params.data.type),
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
