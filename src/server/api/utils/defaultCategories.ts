import type { Prisma } from "@prisma/client";

export const defaultCategories: Prisma.CategoryCreateManyInput[] = [
  {
    name: "Из сбережений",
    shortname: "Из сбережений",
    isContinuous: false,
    isIncome: false,
    type: "FROM_SAVINGS",
  },
  {
    name: "В сбережения",
    shortname: "В сбережения",
    isContinuous: false,
    isIncome: false,
    type: "TO_SAVINGS",
  },
  {
    name: "Личные расходы",
    shortname: "Личные",
    isContinuous: false,
    isIncome: false,
    type: "PERSONAL_EXPENSE",
  },
  {
    name: "Зарплата",
    shortname: "Зарплата",
    isContinuous: false,
    isIncome: true,
    type: null,
  },
];
