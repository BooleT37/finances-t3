import dayjs from "dayjs";
import { isTestMode } from "./tests/isTestMode";

export const TODAY_YEAR = 2024;
export const TODAY_MONTH = 2; // March, since it's 0-based
export const TODAY_DAY = 20;

// this file exists so that we can mock today date in tests
export const getToday = () => {
  if (isTestMode) {
    return dayjs(`${TODAY_YEAR}-${TODAY_MONTH + 1}-${TODAY_DAY}`);
  }
  const today = dayjs();
  return today;
};
