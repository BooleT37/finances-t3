import { type CategoryType } from "@prisma/client";
import Decimal from "decimal.js";
import { decimalSum } from "~/utils/decimalSum";
import { useExpenses } from "./allExpenses";

export const useTotalPerMonth = ({
  year,
  month,
  excludeTypes = [],
}: {
  year: number;
  month: number;
  excludeTypes?: CategoryType[];
}) => {
  const { data: expenses } = useExpenses();
  if (!expenses) return new Decimal(0);

  const monthExpenses = expenses.filter(
    (expense) => expense.date.month() === month && expense.date.year() === year
  );

  return decimalSum(
    ...monthExpenses
      .filter(
        (expense) =>
          !(
            expense.category.type &&
            excludeTypes.includes(expense.category.type)
          )
      )
      .map((expense) => expense.costWithoutComponents ?? new Decimal(0))
  ).plus(
    decimalSum(
      ...monthExpenses.flatMap((e) =>
        e.components
          .filter(
            (c) => !(c.category.type && excludeTypes.includes(c.category.type))
          )
          .map((c) => c.cost)
      )
    )
  );
};

export const useGetTotalPerMonthForCategory = () => {
  const { data: expenses } = useExpenses();
  return ({
    year,
    month,
    categoryId,
  }: {
    year: number;
    month: number;
    categoryId: number;
  }) => {
    if (!expenses) return new Decimal(0);

    const monthExpenses = expenses.filter(
      (expense) =>
        expense.date.month() === month && expense.date.year() === year
    );

    return decimalSum(
      ...monthExpenses
        .filter((expense) => expense.category.id === categoryId)
        .map((expense) => expense.costWithoutComponents ?? new Decimal(0))
    ).plus(
      decimalSum(
        ...monthExpenses.flatMap((e) =>
          e.components
            .filter((c) => c.category.id === categoryId)
            .map((c) => c.cost)
        )
      )
    );
  };
};

export const useGetTotalPerMonthForSubcategory = () => {
  const { data: expenses } = useExpenses();
  return ({
    year,
    month,
    categoryId,
    subcategoryId,
  }: {
    year: number;
    month: number;
    categoryId: number;
    subcategoryId: number | null;
  }) => {
    if (!expenses) return new Decimal(0);

    const monthExpenses = expenses.filter(
      (expense) =>
        expense.date.month() === month && expense.date.year() === year
    );

    return decimalSum(
      ...monthExpenses
        .filter(
          (expense) =>
            expense.category.id === categoryId &&
            expense.subcategoryId === subcategoryId
        )
        .map((expense) => expense.costWithoutComponents ?? new Decimal(0))
    ).plus(
      decimalSum(
        ...monthExpenses.flatMap((e) =>
          e.components
            .filter(
              (c) =>
                c.category.id === categoryId &&
                c.subcategoryId === subcategoryId
            )
            .map((c) => c.cost)
        )
      )
    );
  };
};
