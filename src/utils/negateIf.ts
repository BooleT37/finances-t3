import type Decimal from "decimal.js";

export function negateIf(num: Decimal, condition: boolean) {
  if (condition) {
    return num.neg();
  }
  return num;
}
