import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type Category from "~/features/category/Category";
import { useGetCategoryById } from "~/features/category/facets/categoryById";

interface CategoryModalContextType {
  visible: boolean;
  categoryId: number | null;
  isIncome: boolean;
  currentCategory: Category | undefined;
  isNewCategory: boolean;
  open: (options?: { isIncome?: boolean; expenseId?: number | null }) => void;
  close: () => void;
}

const CategoryModalContext = createContext<
  CategoryModalContextType | undefined
>(undefined);

export function CategoryModalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [isIncome, setIsIncome] = useState(false);
  const getCategoryById = useGetCategoryById();

  const currentCategory = useMemo(
    () =>
      categoryId !== null && getCategoryById.loaded
        ? getCategoryById.getCategoryById(categoryId)
        : undefined,
    [categoryId, getCategoryById]
  );

  const isNewCategory = currentCategory === undefined;

  const open = useCallback(
    (options?: { isIncome?: boolean; expenseId?: number | null }) => {
      setIsIncome(options?.isIncome ?? false);
      setCategoryId(options?.expenseId ?? null);
      setVisible(true);
    },
    []
  );

  const close = useCallback(() => {
    setCategoryId(null);
    setVisible(false);
    setIsIncome(false);
  }, []);

  const value = useMemo(
    () => ({
      visible,
      categoryId,
      isIncome,
      currentCategory,
      isNewCategory,
      open,
      close,
    }),
    [visible, categoryId, isIncome, currentCategory, isNewCategory, open, close]
  );

  return (
    <CategoryModalContext.Provider value={value}>
      {children}
    </CategoryModalContext.Provider>
  );
}

export function useCategoryModalContext() {
  const context = useContext(CategoryModalContext);
  if (context === undefined) {
    throw new Error(
      "useCategoryModalContext must be used within a CategoryModalProvider"
    );
  }
  return context;
}
