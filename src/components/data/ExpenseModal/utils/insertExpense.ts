import { runInAction } from "mobx";
import Expense from "~/models/Expense";
import { dataStores } from "~/stores/dataStores";
import expenseModalViewModel from "../expenseModalViewModel";
import { type ValidatedFormValues } from "../models";
import generatePersonalExpenseName from "./generatePersonalExpenseName";

export default async function insertExpense(
  values: ValidatedFormValues
): Promise<Expense> {
  const category = dataStores.categoriesStore.getById(values.category);
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
    values.source !== undefined
      ? dataStores.sourcesStore.getById(values.source)
      : null,
    values.subscription === undefined
      ? null
      : dataStores.subscriptionStore.getById(values.subscription),
    values.savingSpendingCategoryId === undefined
      ? null
      : dataStores.expenseStore.getSavingSpendingByCategoryId(
          values.savingSpendingCategoryId
        )
  );
  // if we are editing the expense
  if (expenseModalViewModel.expenseId !== null) {
    newExpense.id = expenseModalViewModel.expenseId;
    const modifyingExpense = dataStores.expenseStore.getById(
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
          const category = dataStores.categoriesStore.getById(
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
              category: dataStores.categoriesStore.getById(values.category)
                .name,
              name: values.name,
            }),
            null,
            null
          );
          newExpense.personalExpenseId = personalExpense.id;
          newExpense.cost =
            (newExpense.cost ?? 0) - (personalExpense.cost ?? 0);
          await dataStores.expenseStore.modify(personalExpense);
        }
      } else {
        const category = dataStores.categoriesStore.getById(
          values.personalExpCategoryId
        );
        const personalExpense = new Expense(
          -1,
          parseFloat(values.personalExpSpent),
          values.date,
          category,
          values.subcategory === undefined
            ? null
            : category.findSubcategoryById(values.subcategory),
          generatePersonalExpenseName({
            category: dataStores.categoriesStore.getById(values.category).name,
            name: values.name,
          }),
          null,
          null
        );
        await dataStores.expenseStore.add(personalExpense);
        newExpense.personalExpenseId = personalExpense.id;
        newExpense.cost = (newExpense.cost ?? 0) - (personalExpense.cost ?? 0);
      }
      await dataStores.expenseStore.modify(newExpense);
    } else {
      if (modifyingExpense.personalExpense) {
        const { id: peId } = modifyingExpense.personalExpense;
        newExpense.personalExpenseId = null;
        await dataStores.expenseStore.modify(newExpense);
        await dataStores.expenseStore.delete(peId);
      } else {
        await dataStores.expenseStore.modify(newExpense);
      }
    }
  } else {
    if (values.personalExpCategoryId !== undefined) {
      const category = dataStores.categoriesStore.getById(
        values.personalExpCategoryId
      );
      const personalExpense = new Expense(
        -1,
        parseFloat(values.personalExpSpent),
        values.date,
        category,
        null,
        generatePersonalExpenseName({
          category: dataStores.categoriesStore.getById(values.category).name,
          name: values.name,
        }),
        null,
        null
      );
      newExpense.cost = (newExpense.cost ?? 0) - (personalExpense.cost ?? 0);
      const addedPersonalExpense = await dataStores.expenseStore.add(
        personalExpense
      );
      runInAction(() => {
        newExpense.personalExpenseId = addedPersonalExpense.id;
      });
    }
    await dataStores.expenseStore.add(newExpense);
  }
  return newExpense;
}
