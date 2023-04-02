import type {
  ColDef,
  ColGroupDef,
  IRowNode,
  ValueFormatterParams,
  ValueParserParams,
} from "ag-grid-community";
import { CATEGORY_IDS } from "~/models/Category";
import { sortAllCategories } from "~/readonlyStores/categories/categoriesOrder";
import {
  type ForecastSum,
  type ForecastTableItem,
  type SubscriptionsItem,
} from "~/stores/forecastStore/types";
import costToString from "~/utils/costToString";
import CostCellRenderer from "./CostCellRenderer";
import LastMonthCellRenderer from "./LastMonthCellRenderer";
import ThisMonthCellRenderer from "./ThisMonthCellRenderer";

const costValueFormatter = ({ value }: { value: number }): string =>
  costToString(value);

export interface ForecastSumFromEdit {
  value: number;
  subscriptions: SubscriptionsItem[];
}

const columnDefs: (
  | ColDef<ForecastTableItem>
  | ColGroupDef<ForecastTableItem>
)[] = [
  {
    field: "category",
    sort: "asc",
    width: 250,
    headerName: "Категория",
    tooltipField: "category",
    comparator: (
      categoryA: string,
      _categoryB: string,
      nodeA: IRowNode<ForecastTableItem>,
      nodeB: IRowNode<ForecastTableItem>
    ) =>
      categoryA === "Всего" || !nodeA.data || !nodeB.data
        ? 1
        : sortAllCategories(
            nodeA.data?.categoryShortname,
            nodeB.data?.categoryShortname
          ),
  },
  {
    field: "average",
    width: 150,
    headerName: "В среднем",
    valueFormatter: costValueFormatter,
    tooltipField: "monthsWithSpendings",
  },
  {
    field: "lastMonth",
    width: 160,
    headerName: "Прошлый месяц",
    cellRenderer: LastMonthCellRenderer,
  },
  {
    field: "sum",
    width: 200,
    headerName: "План",
    cellRenderer: CostCellRenderer,
    valueFormatter: (
      params: ValueFormatterParams<ForecastTableItem, ForecastSum>
    ) => String(params.value.value),
    cellEditorParams: {
      useFormatter: true,
    },
    valueParser: (
      params: ValueParserParams<ForecastTableItem>
    ): ForecastSumFromEdit => ({
      value: parseFloat(params.newValue as string),
      subscriptions: (params.oldValue as ForecastSum).subscriptions,
    }),
    editable: ({ data }) =>
      ![CATEGORY_IDS.total, CATEGORY_IDS.fromSavings].includes(
        (data as ForecastTableItem).categoryId
      ),
  },
  {
    field: "thisMonth",
    width: 160,
    headerName: "Факт",
    cellRenderer: ThisMonthCellRenderer,
  },
  {
    field: "comment",
    width: 200,
    headerName: "Комментарий",
    editable: true,
    tooltipField: "comment",
  },
];

export default columnDefs;
