import { observer } from "mobx-react";
import { type ExpenseComponent } from "~/models/ExpenseComponent";
import costToString from "~/utils/costToString";

interface Props {
  cost: number;
  components: ExpenseComponent[];
}

function componentCategoryToString(component: ExpenseComponent): string {
  return component.subcategory
    ? `${component.category.name} - ${component.subcategory.name}`
    : component.category.name;
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
              cost - components.reduce((acc, c) => acc + c.cost, 0)
            )}
            )
          </>
        )}
      </>
    );
  }
);
