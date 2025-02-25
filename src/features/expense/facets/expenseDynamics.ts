import { type Dayjs } from "dayjs";
import Decimal from "decimal.js";
import { useCallback } from "react";
import type { DynamicsDataMonth } from "~/features/statistics/types/dynamicsData";
import { MONTH_DATE_FORMAT } from "~/utils/constants";
import { useExpenses } from "./allExpenses";

export const useGetDynamicsData = () => {
  const { data: expenses } = useExpenses();
  return useCallback(
    (from: Dayjs, to: Dayjs, categoriesIds: number[]) => {
      if (!expenses) return [];

      type MonthEntry = Record<string, Decimal> & { date: Dayjs };
      const dict: Record<string, MonthEntry> = {};

      let filteredExpenses = expenses.filter((e) =>
        e.date.isBetween(from, to, "month", "[]")
      );

      if (categoriesIds.length > 0) {
        filteredExpenses = filteredExpenses.filter((e) =>
          categoriesIds.includes(e.category.id)
        );
      }

      filteredExpenses.forEach((e) => {
        if (e.cost === null) return;
        const cost = e.cost.abs();

        const month = e.date.format("YYYY-MM");
        const monthEntry = dict[month];
        if (monthEntry !== undefined) {
          const monthEntryForCategory = monthEntry[e.category.id];
          if (monthEntryForCategory !== undefined) {
            monthEntry[e.category.id] = monthEntryForCategory.add(cost);
          } else {
            monthEntry[e.category.id] = cost;
          }
        } else {
          dict[month] = {
            date: e.date,
            [e.category.id.toString()]: cost,
          } as MonthEntry;
        }
      });

      let interim = from.clone();
      const allCategoriesIds =
        categoriesIds.length === 0
          ? [...new Set(expenses.map((e) => e.category.id))]
          : categoriesIds;

      while (to > interim || interim.format("M") === to.format("M")) {
        const month = interim.format("YYYY-MM");
        if (dict[month] === undefined) {
          dict[month] = {
            date: interim.clone(),
          } as MonthEntry;
        }
        const monthEntry = dict[month];
        for (const categoryId of allCategoriesIds) {
          if (monthEntry[categoryId] === undefined) {
            monthEntry[categoryId] = new Decimal(0);
          }
        }
        interim = interim.add(1, "month");
      }

      const data: DynamicsDataMonth[] = Object.values(dict)
        .sort((a, b) => (a.date.isBefore(b.date, "month") ? -1 : 1))
        .map((e) => {
          const month = e.date.format(MONTH_DATE_FORMAT);
          const { date, ...eWithoutDate } = { ...e };
          return { month, ...eWithoutDate } as DynamicsDataMonth;
        });

      data.forEach((m) => {
        Object.keys(m).forEach((k) => {
          const value = m[k];
          if (Decimal.isDecimal(value)) {
            m[k] = value.toNumber();
          }
        });
      });

      return data;
    },
    [expenses]
  );
};
