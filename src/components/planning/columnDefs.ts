import type {
  ColDef,
  ColGroupDef,
  IRowNode,
  ValueFormatterParams,
  ValueParserParams,
} from "ag-grid-community";
import Decimal from "decimal.js";
import { action } from "mobx";
import { TOTAL_CATEGORY_ID } from "~/models/Category";
import {
  type ForecastSum,
  type ForecastTableItem,
} from "~/stores/ForecastStore/types";
import type { ForecastSubscriptionsItem } from "~/types/forecast/forecastTypes";
import costToString from "~/utils/costToString";
import CostCellRenderer from "./CostCellRenderer";
import LastMonthCellRenderer from "./LastMonthCellRenderer";
import { planningScreenViewModel } from "./PlanningScreenViewModel";
import ThisMonthCellRenderer from "./ThisMonthCellRenderer";

const costValueFormatter = ({ value }: { value: number }): string =>
  costToString(value);

export interface ForecastSumFromEdit {
  value: Decimal;
  subscriptions: ForecastSubscriptionsItem[];
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
    comparator: action(
      (
        categoryA: string,
        _categoryB: string,
        nodeA: IRowNode<ForecastTableItem>,
        nodeB: IRowNode<ForecastTableItem>
      ) => planningScreenViewModel.compareCategories(categoryA, nodeA, nodeB)
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
    ) => params.value.value?.toFixed() ?? "",
    cellEditorParams: {
      useFormatter: true,
    },
    valueParser: (
      params: ValueParserParams<ForecastTableItem>
    ): ForecastSumFromEdit => {
      const parsed = new Decimal((params.newValue as string | null) ?? 0);
      const oldValue = params.oldValue as ForecastSum;
      if (parsed.isNaN()) {
        return {
          value: oldValue.value ?? new Decimal(0),
          subscriptions: oldValue.subscriptions,
        };
      }
      return {
        value: parsed,
        subscriptions: oldValue.subscriptions,
      };
    },
    editable: ({ data }) =>
      data?.categoryId !== TOTAL_CATEGORY_ID &&
      data?.categoryType !== "FROM_SAVINGS",
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
