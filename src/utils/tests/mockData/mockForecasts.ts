import { Decimal } from "decimal.js";
import { type ApiForecast } from "~/features/forecast/api/types";

export const mockForecasts: ApiForecast[] = [
  // February 2024 forecasts
  {
    id: 1,
    categoryId: 4, // Продукты
    subcategoryId: 3, // Супермаркет
    month: 2,
    year: 2024,
    sum: new Decimal(50), // Expected ~50€ for supermarket
    comment: "",
    userId: "1",
  },
  {
    id: 2,
    categoryId: 5, // Транспорт
    subcategoryId: 6, // Такси
    month: 2,
    year: 2024,
    sum: new Decimal(20), // Expected ~20€ for taxi
    comment: "Только для важных поездок",
    userId: "1",
  },
  {
    id: 3,
    categoryId: 3, // Зарплата
    subcategoryId: 1, // Основная
    month: 2,
    year: 2024,
    sum: new Decimal(3000), // Expected salary
    comment: "",
    userId: "1",
  },
  {
    id: 4,
    categoryId: 4, // Продукты
    subcategoryId: null,
    month: 2,
    year: 2024,
    sum: new Decimal(100), // Total expected for products category
    comment: "Включая подписки",
    userId: "1",
  },
  {
    id: 5,
    categoryId: 1, // FROM_SAVINGS
    subcategoryId: null,
    month: 2,
    year: 2024,
    sum: new Decimal(1000), // Expected savings spending
    comment: "Переезд и ремонт",
    userId: "1",
  },
  {
    id: 6,
    categoryId: 4, // Продукты
    subcategoryId: 4, // Рынок
    month: 2,
    year: 2024,
    sum: new Decimal(0), // As if we accidentally saved zero for this category
    comment: "",
    userId: "1",
  },
  {
    id: 11,
    categoryId: 7, // Хобби
    subcategoryId: null,
    month: 2,
    year: 2024,
    sum: new Decimal(80), // Expected 80€ for hobbies
    comment: "",
    userId: "1",
  },

  // March 2024 forecasts
  {
    id: 7,
    categoryId: 4, // Продукты
    subcategoryId: 3, // Супермаркет
    month: 3,
    year: 2024,
    sum: new Decimal(55), // Increased expectation for supermarket
    comment: "",
    userId: "1",
  },
  {
    id: 8,
    categoryId: 5, // Транспорт
    subcategoryId: 6, // Такси
    month: 3,
    year: 2024,
    sum: new Decimal(25), // Increased expectation for taxi
    comment: "",
    userId: "1",
  },
  {
    id: 9,
    categoryId: 3, // Зарплата
    subcategoryId: 1, // Основная
    month: 3,
    year: 2024,
    sum: new Decimal(3000), // Same salary expectation
    comment: "",
    userId: "1",
  },
  {
    id: 10,
    categoryId: 4, // Продукты
    subcategoryId: null,
    month: 3,
    year: 2024,
    sum: new Decimal(110), // Increased total for products
    comment: "Включая подписки",
    userId: "1",
  },
  {
    id: 12,
    categoryId: 1, // FROM_SAVINGS
    subcategoryId: null,
    month: 3,
    year: 2024,
    sum: new Decimal(500), // Less savings spending expected
    comment: "Остаток ремонта",
    userId: "1",
  },
];
