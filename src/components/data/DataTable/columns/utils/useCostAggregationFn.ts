import type { Row } from "@tanstack/react-table";
import Decimal from "decimal.js";
import { runInAction } from "mobx";
import { useCallback } from "react";
import { type CostCol, type TableData } from "~/models/Expense";

export const useCostAggregationFn = () =>
  useCallback((_columnId: string, rows: Row<TableData>[]): CostCol => {
    return runInAction(() => {
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
    });
  }, []);
