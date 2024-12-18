import { TreeSelect, type TreeSelectProps } from "antd";
import { observer } from "mobx-react";
import { dataStores } from "~/stores/dataStores";
import { type CategorySubcategoryId } from "./categorySubcategoryId";

export interface CategoryTreeSelectOption {
  label: string;
  displayedText: string;
  value: `${number}`;
  children?: {
    label: string;
    value: `${number}-${number}`;
  }[];
}

type Props = TreeSelectProps<
  CategorySubcategoryId,
  CategoryTreeSelectOption
> & {
  currentSelectedCategoryId?: number | null;
  isExpense: boolean;
};

export const CategorySubcategorySelect: React.FC<Props> = observer((props) => {
  const { currentSelectedCategoryId, isExpense, ...restProps } = props;
  const treeData = isExpense
    ? dataStores.categoriesStore.expenseCategoriesTreeOptions
    : dataStores.categoriesStore.incomeCategoriesTreeOptions;
  return (
    <TreeSelect<CategorySubcategoryId, CategoryTreeSelectOption>
      treeData={treeData}
      placeholder="Категория"
      style={{ width: 200 }}
      treeNodeLabelProp="displayedText"
      treeDefaultExpandedKeys={
        currentSelectedCategoryId === null ||
        currentSelectedCategoryId === undefined
          ? []
          : [currentSelectedCategoryId.toString()]
      }
      {...restProps}
    />
  );
});
