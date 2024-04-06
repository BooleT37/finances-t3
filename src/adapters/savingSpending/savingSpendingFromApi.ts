import { type inferRouterOutputs } from "@trpc/server";
import SavingSpending from "~/models/SavingSpending";
import SavingSpendingCategory from "~/models/SavingSpendingCategory";
import { type AppRouter } from "~/server/api/root";

export function adaptSavingSpendingFromApi(
  savingSpending: inferRouterOutputs<AppRouter>["savingSpending"]["getAll"][number]
) {
  return new SavingSpending(
    savingSpending.id,
    savingSpending.name,
    savingSpending.completed,
    savingSpending.categories.map(
      (savingSpending) =>
        new SavingSpendingCategory(
          savingSpending.id,
          savingSpending.name,
          savingSpending.forecast,
          savingSpending.comment
        )
    )
  );
}
