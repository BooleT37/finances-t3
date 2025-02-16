import type { inferRouterOutputs } from "@trpc/server";
import { Decimal } from "decimal.js";
import type { AppRouter } from "~/server/api/root";

type RouterOutput = inferRouterOutputs<AppRouter>;
type SavingSpendingWithCategories =
  RouterOutput["savingSpending"]["getAll"][number];

export const mockSavingSpendings: SavingSpendingWithCategories[] = [
  {
    id: 1,
    name: "Переезд",
    completed: false,
    userId: "1",
    categories: [
      {
        id: 1,
        name: "Мебель",
        forecast: new Decimal(2000),
        comment: "Диван и стол",
        savingSpendingId: 1,
      },
      {
        id: 2,
        name: "Техника",
        forecast: new Decimal(1500),
        comment: "Холодильник",
        savingSpendingId: 1,
      },
    ],
  },
  {
    id: 2,
    name: "Отпуск летом",
    completed: false,
    userId: "1",
    categories: [
      {
        id: 3,
        name: "Билеты",
        forecast: new Decimal(800),
        comment: "Туда и обратно",
        savingSpendingId: 2,
      },
      {
        id: 4,
        name: "Отель",
        forecast: new Decimal(1200),
        comment: "7 ночей",
        savingSpendingId: 2,
      },
    ],
  },
  {
    id: 3,
    name: "Ремонт в ванной",
    completed: true,
    userId: "1",
    categories: [
      {
        id: 5,
        name: "Ремонт",
        forecast: new Decimal(500),
        comment: "Материалы",
        savingSpendingId: 3,
      },
      {
        id: 6,
        name: "Сантехника",
        forecast: new Decimal(300),
        comment: "Новая раковина",
        savingSpendingId: 3,
      },
    ],
  },
  {
    id: 4,
    name: "Новая машина",
    completed: false,
    userId: "1",
    categories: [],
  },
];
