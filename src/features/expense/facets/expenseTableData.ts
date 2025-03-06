import { type Dayjs } from "dayjs";
import { useCallback } from "react";
import { DATE_FORMAT } from "~/utils/constants";
import type Expense from "../Expense";
import { type CostCol, type ExpenseTableData } from "../Expense";
import { useExpenses } from "./allExpenses";
import { useGetAvailableSubscriptions } from "./availableSubscriptions";

/**
 * Returns table data for expenses within the given date range and search criteria.
 * Includes expense components and optionally upcoming subscriptions.
 */
export const useGetExpenseTableData = () => {
  const { data: expenses } = useExpenses();
  const getAvailableSubscriptions = useGetAvailableSubscriptions();

  return useCallback(
    ({
      startDate,
      endDate,
      searchString,
      includeUpcomingSubscriptions,
    }: {
      startDate: Dayjs;
      endDate: Dayjs;
      searchString: string;
      includeUpcomingSubscriptions: boolean;
    }): ExpenseTableData[] | undefined => {
      if (!expenses) return undefined;

      const filteredRows = expenses
        .filter(
          (e: Expense) =>
            e.date.isSameOrAfter(startDate.startOf("day")) &&
            e.date.isSameOrBefore(endDate.endOf("day")) &&
            (!searchString ||
              e.name?.toLowerCase().includes(searchString.toLowerCase()))
        )
        .sort((a, b) => (a.date.isBefore(b.date) ? -1 : 1));

      const rows = filteredRows.map((ex: Expense) => ex.asTableData);
      const components = filteredRows.flatMap((e: Expense) =>
        e.components.map((c) => c.asTableData)
      );

      if (includeUpcomingSubscriptions) {
        const subscriptions = getAvailableSubscriptions(startDate, endDate)
          .map(
            ({ subscription, firstDate }): ExpenseTableData => ({
              category: subscription.category.name,
              categoryId: subscription.category.id,
              categoryShortname: subscription.category.shortname,
              categoryIcon: subscription.category.icon ?? null,
              subcategory: "",
              subcategoryId: null,
              source: subscription.source?.name ?? "",
              cost: {
                value: subscription.cost,
                isSubscription: true,
                isUpcomingSubscription: true,
                isIncome: false,
              } as CostCol,
              date: firstDate.format(DATE_FORMAT),
              id: -1, // Temporary ID for upcoming subscriptions
              isUpcomingSubscription: true,
              name: subscription.name,
              expenseId: null,
              isIncome: false,
              isContinuous: false,
            })
          )
          .filter((data) => !searchString || data.name.includes(searchString));

        return [...rows, ...subscriptions, ...components];
      }

      return [...rows, ...components];
    },
    [expenses, getAvailableSubscriptions]
  );
};
