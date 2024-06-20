import type Decimal from "decimal.js";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import { type ExpenseComponentData } from "~/models/Expense";
import { dataStores } from "~/stores/dataStores";
import costToString from "~/utils/costToString";
import { decimalSum } from "~/utils/decimalSum";

interface Props {
  cost: Decimal;
  components: ExpenseComponentData[];
}

function componentCategoryToString(component: ExpenseComponentData): string {
  return runInAction(() => {
    const category = dataStores.categoriesStore.getById(component.categoryId);
    const subcategory =
      component.subcategoryId === null
        ? null
        : category.findSubcategoryById(component.subcategoryId);
    return subcategory
      ? `${category.name} - ${subcategory.name}`
      : category.name;
  });
}

export const ComponentsHint: React.FC<Props> = observer(
  ({ cost, components }) => {
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
  }
);
