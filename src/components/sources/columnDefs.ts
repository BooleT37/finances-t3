import { type ColDef, type ICellRendererParams } from "ag-grid-community";
import { type SourceTableItem } from "~/models/Source";
import { DeleteHeaderIcon } from "../shared/headerIcons";
import RemoveButtonRenderer from "./RemoveButtonRenderer";

export const сolumnDefs: ColDef<SourceTableItem>[] = [
  {
    field: "name",
    headerName: "Имя",
    editable: true,
    rowDrag: true,
  },
  {
    field: "remove",
    headerName: "",
    headerComponent: DeleteHeaderIcon,
    cellRendererSelector: (params: ICellRendererParams<SourceTableItem>) => {
      // if it's a group row or an upcoming subscription
      if (!params.data) {
        return;
      }
      return {
        component: RemoveButtonRenderer,
        params: {
          id: params.data.id,
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
