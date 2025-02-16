import type { ApiCategoryWithSubcategories } from "~/features/category/api/types";

export const mockCategories: ApiCategoryWithSubcategories[] = [
  {
    id: 1,
    name: "Из сбережений",
    shortname: "Из сбережений",
    isContinuous: false,
    isIncome: false,
    type: "FROM_SAVINGS",
    userId: "1",
    subcategories: [],
    icon: null,
  },
  {
    id: 2,
    name: "В сбережения",
    shortname: "В сбережения",
    isContinuous: false,
    isIncome: false,
    type: "TO_SAVINGS",
    userId: "1",
    subcategories: [],
    icon: null,
  },
  {
    id: 3,
    name: "Зарплата",
    shortname: "Зарплата",
    isContinuous: false,
    isIncome: true,
    type: null,
    userId: "1",
    subcategories: [
      {
        id: 1,
        name: "Основная",
        categoryId: 3,
      },
      {
        id: 2,
        name: "Бонус",
        categoryId: 3,
      },
    ],
    icon: "money-bill",
  },
  {
    id: 4,
    name: "Продукты",
    shortname: "Продукты",
    isContinuous: true,
    isIncome: false,
    type: null,
    userId: "1",
    subcategories: [
      {
        id: 3,
        name: "Супермаркет",
        categoryId: 4,
      },
      {
        id: 4,
        name: "Рынок",
        categoryId: 4,
      },
    ],
    icon: "shopping-cart",
  },
  {
    id: 5,
    name: "Транспорт",
    shortname: "Транспорт",
    isContinuous: true,
    isIncome: false,
    type: null,
    userId: "1",
    subcategories: [
      {
        id: 5,
        name: "Общественный",
        categoryId: 5,
      },
      {
        id: 6,
        name: "Такси",
        categoryId: 5,
      },
    ],
    icon: "car",
  },
  {
    id: 6,
    name: "Развлечения",
    shortname: "Развлечения",
    isContinuous: true,
    isIncome: false,
    type: null,
    userId: "1",
    subcategories: [
      {
        id: 7,
        name: "Кино",
        categoryId: 6,
      },
      {
        id: 8,
        name: "Рестораны",
        categoryId: 6,
      },
      {
        id: 11,
        name: "Музыка",
        categoryId: 6,
      },
    ],
    icon: "film",
  },
  {
    id: 7,
    name: "Хобби",
    shortname: "Хобби",
    isContinuous: true,
    isIncome: false,
    type: null,
    userId: "1",
    subcategories: [
      {
        id: 9,
        name: "Спорт",
        categoryId: 7,
      },
    ],
    icon: "dumbbell",
  },
];
