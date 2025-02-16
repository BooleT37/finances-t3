import { Decimal } from "decimal.js";
import type { ExpenseFromApi } from "~/features/expense/api/types";

export const mockExpenses: ExpenseFromApi[] = [
  {
    // Regular expense with source
    id: 1,
    name: "Продукты в Lidl",
    cost: new Decimal(45.67),
    date: new Date("2024-02-15"),
    actualDate: null,
    categoryId: 4, // Продукты
    subcategoryId: 3, // Супермаркет
    sourceId: 1, // Vivid
    subscriptionId: null,
    savingSpendingCategoryId: null,
    peHash: null,
    userId: "1",
    components: [],
  },
  {
    // Regular expense without source
    id: 2,
    name: "Такси",
    cost: new Decimal(15.3),
    date: new Date("2024-02-16"),
    actualDate: null,
    categoryId: 5, // Транспорт
    subcategoryId: 6, // Такси
    sourceId: null,
    subscriptionId: null,
    savingSpendingCategoryId: null,
    peHash: null,
    userId: "1",
    components: [],
  },
  {
    // Income
    id: 3,
    name: "Зарплата",
    cost: new Decimal(3000),
    date: new Date("2024-02-01"),
    actualDate: null,
    categoryId: 3, // Зарплата
    subcategoryId: 1, // Основная
    sourceId: 2, // Commerzbank
    subscriptionId: null,
    savingSpendingCategoryId: null,
    peHash: null,
    userId: "1",
    components: [],
  },
  {
    // Subscription expense
    id: 4,
    name: "Netflix",
    cost: new Decimal(15.99),
    date: new Date("2024-02-01"),
    actualDate: null,
    categoryId: 4, // Продукты
    subcategoryId: null,
    sourceId: 1, // Vivid
    subscriptionId: 1, // Netflix subscription
    savingSpendingCategoryId: null,
    peHash: null,
    userId: "1",
    components: [],
  },
  {
    // Saving spending expense (Moving - Furniture)
    id: 5,
    name: "Диван IKEA",
    cost: new Decimal(899),
    date: new Date("2024-02-10"),
    actualDate: null,
    categoryId: 1, // FROM_SAVINGS
    subcategoryId: null,
    sourceId: 2, // Commerzbank
    subscriptionId: null,
    savingSpendingCategoryId: 1, // Мебель category from "Переезд" saving spending
    peHash: null,
    userId: "1",
    components: [],
  },
  {
    // Another subscription expense
    id: 6,
    name: "Spotify",
    cost: new Decimal(9.99),
    date: new Date("2024-02-15"),
    actualDate: null,
    categoryId: 4, // Продукты
    subcategoryId: null,
    sourceId: 1, // Vivid
    subscriptionId: 2, // Spotify subscription
    savingSpendingCategoryId: null,
    peHash: null,
    userId: "1",
    components: [],
  },
  {
    // Another saving spending expense (Bathroom renovation - Materials)
    id: 7,
    name: "Плитка",
    cost: new Decimal(250),
    date: new Date("2024-02-20"),
    actualDate: null,
    categoryId: 1, // FROM_SAVINGS
    subcategoryId: null,
    sourceId: 1, // Vivid
    subscriptionId: null,
    savingSpendingCategoryId: 5, // Ремонт category from "Ремонт в ванной" saving spending
    peHash: null,
    userId: "1",
    components: [],
  },
];
