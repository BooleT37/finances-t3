import type { Row } from "@tanstack/react-table";
import Decimal from "decimal.js";
import { useCallback } from "react";
import type { CostCol, ExpenseTableData } from "~/features/expense/Expense";

export const useCostAggregationFn = () =>
  useCallback((_columnId: string, rows: Row<ExpenseTableData>[]): CostCol => {
    const value = rows.reduce(
      (a, c) =>
        c.original.isUpcomingSubscription
          ? a
          : a.add(c.original.cost?.value ?? 0),
      new Decimal(0)
    );

    return {
      value,
    };
  }, []);
