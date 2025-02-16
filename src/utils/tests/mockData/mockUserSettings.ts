import { Decimal } from "decimal.js";
import type { ApiUserSetting } from "~/features/userSettings/api/types";

export const mockUserSettings: ApiUserSetting = {
  expenseCategoriesOrder: [1, 2, 4, 5, 6, 7],
  incomeCategoriesOrder: [3],
  pePerMonth: new Decimal(1000),
  savings: new Decimal(2000),
  savingsDate: new Date("2024-10-01"),
  userId: "1",
  sourcesOrder: [1, 2, 3],
  id: 1,
};
