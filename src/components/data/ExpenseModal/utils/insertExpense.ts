import { runInAction } from "mobx";
import Expense from "~/models/Expense";
import categoriesStore from "~/stores/categoriesStore";
import expenseStore from "~/stores/expenseStore";
import sourcesStore from "~/stores/sourcesStore";
import subscriptionStore from "~/stores/subscriptionStore";
import expenseModalViewModel from "../expenseModalViewModel";
import { type ValidatedFormValues } from "../models";
import generatePersonalExpenseName from "./generatePersonalExpenseName";

export default async function insertExpense(
  values: ValidatedFormValues
): Promise<Expense> {
  const category = categoriesStore.getById(values.category);
  const newExpense = new Expense(
    -1,
    parseFloat(values.cost),
    values.date,
    category,
    values.subcategory === undefined
      ? null
      : category.findSubcategoryById(values.subcategory),
    values.name,
    null,
    values.source !== undefined ? sourcesStore.getById(values.source) : null,
    values.subscription === undefined
      ? null
      : subscriptionStore.getById(values.subscription),
    values.savingSpendingCategoryId === undefined
      ? null
      : expenseStore.getSavingSpendingByCategoryId(
          values.savingSpendingCategoryId
        )
  );
  // if we are editing the expense
  if (expenseModalViewModel.expenseId !== null) {
    newExpense.id = expenseModalViewModel.expenseId;
    const modifyingExpense = expenseStore.getById(
      expenseModalViewModel.expenseId
    );
    if (!modifyingExpense) {
      throw new Error(
        `Can't change the expense with id '${expenseModalViewModel.expenseId}'`
      );
    }
    // if there are personal expenses
    if (values.personalExpCategoryId !== undefined) {
      // if there were personal expenses in the modifying expense
      if (modifyingExpense.personalExpense) {
        const modifyingPe = modifyingExpense.personalExpense;
        // if the personal expenses didn't change
        if (
          modifyingPe.category.id === values.personalExpCategoryId &&
          modifyingPe.cost?.toString() === values.personalExpSpent
        ) {
          newExpense.personalExpenseId = modifyingPe.id;
          newExpense.cost = (newExpense.cost ?? 0) - (modifyingPe.cost ?? 0);
        } else {
          const category = categoriesStore.getById(
            values.personalExpCategoryId
          );
          const personalExpense = new Expense(
            modifyingPe.id,
            parseFloat(values.personalExpSpent),
            modifyingPe.date,
            category,
            values.subcategory === undefined
              ? null
              : category.findSubcategoryById(values.subcategory),
            generatePersonalExpenseName({
              category: categoriesStore.getById(values.category).name,
              name: values.name,
            }),
            null,
            null
          );
          newExpense.personalExpenseId = personalExpense.id;
          newExpense.cost =
            (newExpense.cost ?? 0) - (personalExpense.cost ?? 0);
          await expenseStore.modify(personalExpense);
        }
      } else {
        const category = categoriesStore.getById(values.personalExpCategoryId);
        const personalExpense = new Expense(
          -1,
          parseFloat(values.personalExpSpent),
          values.date,
          category,
          values.subcategory === undefined
            ? null
            : category.findSubcategoryById(values.subcategory),
          generatePersonalExpenseName({
            category: categoriesStore.getById(values.category).name,
            name: values.name,
          }),
          null,
          null
        );
        await expenseStore.add(personalExpense);
        newExpense.personalExpenseId = personalExpense.id;
        newExpense.cost = (newExpense.cost ?? 0) - (personalExpense.cost ?? 0);
      }
      await expenseStore.modify(newExpense);
    } else {
      if (modifyingExpense.personalExpense) {
        const { id: peId } = modifyingExpense.personalExpense;
        newExpense.personalExpenseId = null;
        await expenseStore.modify(newExpense);
        await expenseStore.delete(peId);
      } else {
        await expenseStore.modify(newExpense);
      }
    }
  } else {
    if (values.personalExpCategoryId !== undefined) {
      const category = categoriesStore.getById(values.personalExpCategoryId);
      const personalExpense = new Expense(
        -1,
        parseFloat(values.personalExpSpent),
        values.date,
        category,
        null,
        generatePersonalExpenseName({
          category: categoriesStore.getById(values.category).name,
          name: values.name,
        }),
        null,
        null
      );
      newExpense.cost = (newExpense.cost ?? 0) - (personalExpense.cost ?? 0);
      const addedPersonalExpense = await expenseStore.add(personalExpense);
      runInAction(() => {
        newExpense.personalExpenseId = addedPersonalExpense.id;
      });
    }
    await expenseStore.add(newExpense);
  }
  return newExpense;
}
