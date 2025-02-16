import { TreeSelect, type TreeSelectProps } from "antd";
import {
  useExpenseCategoriesTreeOptions,
  useIncomeCategoriesTreeOptions,
} from "~/features/category/facets/categoryTreeOptions";
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

export const CategorySubcategorySelect: React.FC<Props> = (props) => {
  const { currentSelectedCategoryId, isExpense, ...restProps } = props;
  const expenseCategoriesTreeOptions = useExpenseCategoriesTreeOptions();
  const incomeCategoriesTreeOptions = useIncomeCategoriesTreeOptions();
  const treeData = isExpense
    ? expenseCategoriesTreeOptions
    : incomeCategoriesTreeOptions;
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
};
