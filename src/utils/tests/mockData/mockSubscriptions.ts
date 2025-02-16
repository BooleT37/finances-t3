import { Decimal } from "decimal.js";
import type { ApiSubscription } from "~/features/subscription/api/types";

export const mockSubscriptions: ApiSubscription[] = [
  {
    id: 1,
    name: "Netflix",
    cost: new Decimal(15.99),
    categoryId: 6, // Развлечения
    subcategoryId: null,
    period: 1, // monthly
    firstDate: new Date("2024-01-01"),
    sourceId: 1, // Vivid
    active: true,
    userId: "1",
  },
  {
    id: 2,
    name: "Spotify",
    cost: new Decimal(9.99),
    categoryId: 6, // Развлечения
    subcategoryId: null,
    period: 1, // monthly
    firstDate: new Date("2024-01-15"),
    sourceId: 1, // Vivid
    active: true,
    userId: "1",
  },
  {
    id: 3,
    name: "Проездной BVG",
    cost: new Decimal(86),
    categoryId: 5, // Транспорт
    subcategoryId: 5, // Общественный
    period: 1, // monthly
    firstDate: new Date("2024-01-01"),
    sourceId: 2, // Commerzbank
    active: true,
    userId: "1",
  },
  {
    id: 4,
    name: "Абонемент в спортзал",
    cost: new Decimal(29.99),
    categoryId: 7, // Хобби
    subcategoryId: null,
    period: 1, // monthly
    firstDate: new Date("2024-02-01"),
    sourceId: 1, // Vivid
    active: true,
    userId: "1",
  },
  {
    id: 5,
    name: "Годовая страховка",
    cost: new Decimal(240),
    categoryId: 4, // Продукты
    subcategoryId: null,
    period: 12, // yearly
    firstDate: new Date("2024-01-01"),
    sourceId: 2, // Commerzbank
    active: true,
    userId: "1",
  },
];
