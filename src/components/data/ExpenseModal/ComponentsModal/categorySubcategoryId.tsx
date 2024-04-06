export type CategorySubcategoryId = `${number}-${number}` | `${number}`;

export const parseCategorySubcategoryId = (
  categorySubcategoryId: CategorySubcategoryId
): { categoryId: number; subcategoryId: number | null } => {
  const ids = categorySubcategoryId.split("-").map((id) => parseInt(id, 10));
  const categoryId = ids[0];
  if (Number.isNaN(categoryId) || categoryId === undefined) {
    throw new Error(`Invalid categorySubcategoryId: ${categorySubcategoryId}`);
  }
  if (ids.length === 1) {
    return { categoryId, subcategoryId: null };
  }
  const subcategoryId = ids[1];
  if (Number.isNaN(subcategoryId) || subcategoryId === undefined) {
    throw new Error(`Invalid categorySubcategoryId: ${categorySubcategoryId}`);
  }
  return { categoryId, subcategoryId };
};

export const buildCategorySubcategoryId = ({
  categoryId,
  subcategoryId,
}: {
  categoryId: number;
  subcategoryId?: number;
}): CategorySubcategoryId =>
  subcategoryId === undefined
    ? `${categoryId}`
    : `${categoryId}-${subcategoryId}`;
