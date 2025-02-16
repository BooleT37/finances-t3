import { message } from "antd";
import dayjs from "dayjs";
import Decimal from "decimal.js";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import type { ParsedExpenseFromApi } from "~/features/parsedExpense/api/types";
import { useGetExistingExpense } from "~/features/parsedExpense/facets/parsedExpenseExistingExpense";
import { type ParsedExpense } from "~/features/parsedExpense/ParsedExpense";
import { useSourceById } from "~/features/source/facets/sourceById";
import type Source from "~/features/source/Source";

interface ImportModalContextValue {
  visible: boolean;
  loading: boolean;
  selectedSourceId: number | null;
  selectedSource: Source | null;
  parsedExpenses: ParsedExpense[] | null;
  open: () => void;
  close: () => void;
  setLoading: (loading: boolean) => void;
  setSelectedSourceId: (id: number | null) => void;
  setParsedExpenses: (expenses: ParsedExpenseFromApi[]) => void;
  removeParsedExpenses: () => void;
}

const ImportModalContext = createContext<ImportModalContextValue | null>(null);

export const ImportModalContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSourceId, setSelectedSourceId] = useState<number | null>(null);
  const [parsedExpenses, setParsedExpenses] = useState<ParsedExpense[] | null>(
    null
  );
  const sourceById = useSourceById();

  const open = useCallback(() => {
    setVisible(true);
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    setLoading(false);
  }, []);

  const selectedSource = useMemo(() => {
    if (selectedSourceId === null || !sourceById.loaded) {
      return null;
    }
    return sourceById.getSourceById(selectedSourceId);
  }, [sourceById, selectedSourceId]);

  const getExistingExpense = useGetExistingExpense();

  const setAndAdaptParsedExpenses = useCallback(
    (expenses: ParsedExpenseFromApi[]) => {
      const adaptedExpenses = expenses.map<ParsedExpense>((expense) => ({
        date: dayjs(expense.date),
        type: expense.type,
        description: expense.description,
        amount: new Decimal(expense.amount),
        hash: expense.hash,
      }));
      setParsedExpenses(adaptedExpenses);

      if (adaptedExpenses.some((e) => !!getExistingExpense(e))) {
        void message.warning(
          "Расходы, не отмеченные галочкой, уже существуют в базе данных"
        );
      }
    },
    [getExistingExpense]
  );

  const removeParsedExpenses = useCallback(() => {
    setParsedExpenses(null);
  }, []);

  const value = useMemo(
    () => ({
      visible,
      loading,
      open,
      close,
      setLoading,
      selectedSource,
      selectedSourceId,
      setSelectedSourceId,
      parsedExpenses,
      setParsedExpenses: setAndAdaptParsedExpenses,
      removeParsedExpenses,
    }),
    [
      visible,
      loading,
      open,
      close,
      selectedSource,
      selectedSourceId,
      parsedExpenses,
      setAndAdaptParsedExpenses,
      removeParsedExpenses,
    ]
  );

  return (
    <ImportModalContext.Provider value={value}>
      {children}
    </ImportModalContext.Provider>
  );
};

export const useImportModalContext = () => {
  const context = useContext(ImportModalContext);
  if (!context) {
    throw new Error(
      "useImportModalContext must be used within ImportModalContextProvider"
    );
  }
  return context;
};
