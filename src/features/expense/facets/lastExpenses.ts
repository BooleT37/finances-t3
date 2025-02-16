import dayjs from "dayjs";
import { useSources } from "~/features/source/facets/allSources";
import { useExpenses } from "./allExpenses";

export const useLastExpensesPerSource = () => {
  const { data: expenses } = useExpenses();
  const { data: sources } = useSources();
  if (!expenses || !sources) return {};

  return Object.fromEntries(
    sources.map<[number, typeof expenses]>((s) => {
      const expensesWithSource = expenses.filter((e) => e.source?.id === s.id);
      if (expensesWithSource.length > 0) {
        const lastDate = dayjs.max(
          expensesWithSource.map((e) => e.calculatedActualDate)
        );
        return [
          s.id,
          expensesWithSource.filter((expense) =>
            expense.calculatedActualDate.isSame(lastDate, "date")
          ),
        ];
      }
      return [s.id, []];
    })
  );
};
