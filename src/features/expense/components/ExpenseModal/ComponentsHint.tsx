import type Decimal from "decimal.js";
import { useCallback } from "react";
import { useGetCategoryById } from "~/features/category/facets/categoryById";
import { type ExpenseComponentData } from "~/features/expense/Expense";
import { costToString } from "~/utils/costUtils";
import { decimalSum } from "~/utils/decimalSum";

interface Props {
  cost: Decimal;
  components: ExpenseComponentData[];
}

function useComponentCategoryToString() {
  const getCategoryById = useGetCategoryById();
  return useCallback(
    (component: ExpenseComponentData) => {
      if (!getCategoryById.loaded) {
        return "Загрузка категорий...";
      }
      const category = getCategoryById.getCategoryById(component.categoryId);
      const subcategory =
        component.subcategoryId === null
          ? null
          : category.findSubcategoryById(component.subcategoryId);
      return subcategory
        ? `${category.name} - ${subcategory.name}`
        : category.name;
    },
    [getCategoryById]
  );
}

export const ComponentsHint: React.FC<Props> = ({ cost, components }) => {
  const componentCategoryToString = useComponentCategoryToString();
  return (
    <>
      {components.length === 1 && components[0] ? (
        <>
          Из них {costToString(components[0].cost)} из &quot;
          {componentCategoryToString(components[0])}&quot;
        </>
      ) : (
        <>
          Из них:
          <ul style={{ marginBottom: 0 }}>
            {components.map((component) => (
              <li key={component.id}>
                {costToString(component.cost)} из &quot;
                {componentCategoryToString(component)}&quot;
              </li>
            ))}
          </ul>
          (остаток:{" "}
          {costToString(
            cost.minus(decimalSum(...components.map((c) => c.cost, 0)))
          )}
          )
        </>
      )}
    </>
  );
};
