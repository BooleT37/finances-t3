import Decimal from "decimal.js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useGetCategoryById } from "~/features/category/facets/categoryById";
import { useSubcategoryById } from "~/features/category/facets/subcategoryById";
import {
  useAddExpense,
  useUpdateExpense,
} from "~/features/expense/api/expensesApi";
import type Expense from "~/features/expense/Expense";
import type { ExpenseComponentData } from "~/features/expense/Expense";
import { ExpenseComponent } from "~/features/expense/ExpenseComponent";
import { useExpenseById } from "~/features/expense/facets/expenseById";
import type { ExpenseFromApi } from "../../api/types";
import { useAdaptExpenseFromFormValues } from "./expenseModalUtils";
import type { ValidatedFormValues } from "./models";

interface ExpenseModalContextType {
  visible: boolean;
  expenseId: number | null;
  lastExpenseId: number | null;
  lastSource: number | undefined;
  currentComponents: ExpenseComponentData[];
  componentsModalOpen: boolean;
  componentsModalIdHighlighted: number | null;
  actualDateShown: boolean;
  currentExpense: Expense | undefined;
  lastExpense: Expense | undefined;
  isNewExpense: boolean;
  addMore: boolean;
  open: (expenseId: number | null) => void;
  close: (source: number | undefined) => void;
  reset: () => void;
  setLastExpenseId: (expenseId: number) => void;
  insertExpense: (values: ValidatedFormValues) => Promise<ExpenseFromApi>;
  setCurrentComponents: (components: ExpenseComponentData[]) => void;
  setComponentsModalOpen: (open: boolean) => void;
  highlightComponentInModal: (id: number) => void;
  setActualDateShown: (shown: boolean) => void;
  setAddMore: (addMore: boolean) => void;
}

const ExpenseModalContext = createContext<ExpenseModalContextType | undefined>(
  undefined
);

export function ExpenseModalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const [expenseId, setExpenseId] = useState<number | null>(null);
  const [lastExpenseId, setLastExpenseId] = useState<number | null>(null);
  const [lastSource, setLastSource] = useState<number | undefined>(undefined);
  const [currentComponents, setCurrentComponents] = useState<
    ExpenseComponentData[]
  >([]);
  const [componentsModalOpen, setComponentsModalOpen] = useState(false);
  const [componentsModalIdHighlighted, setComponentsModalIdHighlighted] =
    useState<number | null>(null);
  const [actualDateShown, setActualDateShown] = useState(false);
  const [addMore, setAddMore] = useState(true);

  const expenseById = useExpenseById();
  const { mutateAsync: addExpense } = useAddExpense();
  const { mutateAsync: updateExpense } = useUpdateExpense();
  const adaptExpenseFromFormValues = useAdaptExpenseFromFormValues();
  const subcategoryById = useSubcategoryById();
  const categoryById = useGetCategoryById();

  const currentExpense =
    expenseId !== null && expenseById.loaded
      ? expenseById.getExpenseById(expenseId)
      : undefined;
  const lastExpense =
    lastExpenseId !== null && expenseById.loaded
      ? expenseById.getExpenseById(lastExpenseId)
      : undefined;
  const isNewExpense = !currentExpense;

  const open = useCallback((newExpenseId: number | null) => {
    setExpenseId(newExpenseId);
    setVisible(true);
  }, []);

  useEffect(() => {
    if (currentExpense) {
      setCurrentComponents(
        currentExpense.components.map((c) => ({
          id: c.id,
          name: c.name,
          cost: c.cost,
          categoryId: c.category.id,
          subcategoryId: c.subcategory?.id ?? null,
        }))
      );
    } else {
      setCurrentComponents([]);
    }
  }, [currentExpense]);

  const close = useCallback((source: number | undefined) => {
    setExpenseId(null);
    setCurrentComponents([]);
    setLastSource(source);
    setVisible(false);
    setLastExpenseId(null);
  }, []);

  const reset = useCallback(() => {
    setExpenseId(null);
    setCurrentComponents([]);
    setLastExpenseId(null);
  }, []);

  const highlightComponentInModal = useCallback((id: number) => {
    setComponentsModalIdHighlighted(id);
    setTimeout(() => {
      setComponentsModalIdHighlighted(null);
    }, 3500);
  }, []);

  const insertExpense = useCallback(
    async (values: ValidatedFormValues): Promise<ExpenseFromApi> => {
      const expense = adaptExpenseFromFormValues(values);

      if (currentComponents.length > 0) {
        if (!categoryById.loaded || !subcategoryById.loaded) {
          throw new Error(
            "Cannot create components: categories or subcategories not loaded"
          );
        }

        const components = currentComponents.map((c) => {
          const componentSubcategory =
            c.subcategoryId !== null
              ? subcategoryById.getSubcategoryById(
                  c.categoryId,
                  c.subcategoryId
                )
              : null;

          return new ExpenseComponent(
            c.id,
            c.name,
            new Decimal(c.cost),
            categoryById.getCategoryById(c.categoryId),
            componentSubcategory,
            expense
          );
        });

        expense.setComponents(components);
      }

      if (expenseId !== null) {
        expense.id = expenseId;
        return updateExpense(expense);
      } else {
        return addExpense(expense);
      }
    },
    [
      expenseId,
      addExpense,
      updateExpense,
      adaptExpenseFromFormValues,
      currentComponents,
      subcategoryById,
      categoryById,
    ]
  );

  const value = useMemo(
    () => ({
      visible,
      expenseId,
      lastExpenseId,
      lastSource,
      currentComponents,
      componentsModalOpen,
      componentsModalIdHighlighted,
      actualDateShown,
      currentExpense,
      lastExpense,
      isNewExpense,
      addMore,
      open,
      close,
      reset,
      setLastExpenseId,
      insertExpense,
      setCurrentComponents,
      setComponentsModalOpen,
      highlightComponentInModal,
      setActualDateShown,
      setAddMore,
    }),
    [
      visible,
      expenseId,
      lastExpenseId,
      lastSource,
      currentComponents,
      componentsModalOpen,
      componentsModalIdHighlighted,
      actualDateShown,
      currentExpense,
      lastExpense,
      isNewExpense,
      addMore,
      open,
      close,
      reset,
      insertExpense,
      highlightComponentInModal,
    ]
  );

  return (
    <ExpenseModalContext.Provider value={value}>
      {children}
    </ExpenseModalContext.Provider>
  );
}

export function useExpenseModalContext() {
  const context = useContext(ExpenseModalContext);
  if (context === undefined) {
    throw new Error(
      "useExpenseModal must be used within an ExpenseModalProvider"
    );
  }
  return context;
}
