import Decimal from "decimal.js";

export function costToString(value: Decimal | number): string {
  const parsedValue = typeof value === "number" ? new Decimal(value) : value;
  return parsedValue.isPos() || parsedValue.isZero()
    ? `€${parsedValue.toFixed(2)}`
    : `-€${parsedValue.neg().toFixed(2)}`;
}

export function costToDiffString(value: Decimal | number): string {
  const string = costToString(value);
  const parsedValue = typeof value === "number" ? new Decimal(value) : value;
  return parsedValue.isNeg() ? string : `+${string}`;
}
