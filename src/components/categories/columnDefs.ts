import { type CategoryType } from "@prisma/client";
import {
  type ColDef,
  type EditableCallbackParams,
  type ICellRendererParams,
  type ITooltipParams,
} from "ag-grid-community";
import { type CategoryTableItem } from "~/models/Category";
import { DeleteHeaderIcon } from "../shared/headerIcons";
import RemoveButtonRenderer from "./RemoveButtonRenderer";
import {
  ALL_CATEGORY_TYPES,
  categoryTypeTranslations,
} from "./utils.ts/categoryTypeUtils";

const REQUIRED_CATEGORIES = ["FROM_SAVINGS", "TO_SAVINGS"];

function isNotRequired({ node }: EditableCallbackParams<CategoryTableItem>) {
  return !node.data?.type || !REQUIRED_CATEGORIES.includes(node.data?.type);
}

function requiredTooltipValueGetter({
  node,
}: ITooltipParams<CategoryTableItem>) {
  if (!node?.data?.type || !REQUIRED_CATEGORIES.includes(node.data?.type)) {
    return undefined;
  }
  return "Невозможно редактировать это поле: это системная категория";
}

export const columnDefs: ColDef<CategoryTableItem>[] = [
  {
    field: "name",
    headerName: "Имя",
    resizable: true,
    editable: true,
  },
  {
    field: "shortname",
    headerName: "Короткое имя",
    editable: true,
  },
  {
    field: "type",
    headerName: "Тип",
    editable: isNotRequired,
    tooltipValueGetter: requiredTooltipValueGetter,
    valueFormatter: ({ value }) =>
      value ? categoryTypeTranslations[value as CategoryType] : "Нет типа",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: ([null] as (CategoryType | null)[]).concat(ALL_CATEGORY_TYPES),
    },
  },
  {
    field: "isContinuous",
    headerName: "Непрерывная",
    headerTooltip:
      "Вносятся ли траты в эту категорию постоянно в течение всей недели. " +
      "Примеры: продукты, бытовые товары. Этот параметр используется, чтобы понять, рисовать ли " +
      'предупреждение о потенциальном превышении расходов ("если продолжать тратить с такой же ' +
      'скоростью, вы превысите лимит к концу месяца", желтым цветом), или отображать лишь предупреждение о ' +
      "фактическом превышении лимита на месяц (красным цветом). " +
      "В будущем этот параметр может также быть использован для составления прогнозов трат",
    editable: isNotRequired,
    tooltipValueGetter: requiredTooltipValueGetter,
    valueFormatter: ({ value }) => (value ? "Да" : "Нет"),
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: [true, false],
    },
    valueParser: ({ newValue }) => newValue === "Да",
  },
  {
    field: "isIncome",
    headerName: "Доход/расход",
    editable: isNotRequired,
    tooltipValueGetter: requiredTooltipValueGetter,
    valueFormatter: ({ value }) => {
      const booleanValue =
        typeof value === "string" ? value === "true" : (value as boolean);
      return booleanValue ? "Доход" : "Расход";
    },
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: [true, false],
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
