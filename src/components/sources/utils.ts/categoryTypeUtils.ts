import { CategoryType } from "@prisma/client";

export const ALL_CATEGORY_TYPES = [
  CategoryType.PERSONAL_EXPENSE,
  CategoryType.RENT,
];

export const categoryTypeTranslations: Record<CategoryType, string> = {
  FROM_SAVINGS: "Из сбережений",
  PERSONAL_EXPENSE: "Личные расходы",
  RENT: "Аренда",
  TO_SAVINGS: "В сбережения",
};

export const mapTranslationToCategoryType = (translation: string) => {
  const found = ALL_CATEGORY_TYPES.find(
    (t) => categoryTypeTranslations[t] === translation
  );
  if (!found) {
    throw new Error(`Не нашли тип категории с именем ${translation}`);
  }
  return found;
};
