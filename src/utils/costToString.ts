import Decimal from "decimal.js";

export default function costToString(value: Decimal | number) {
  const parsedValue = typeof value === "number" ? new Decimal(value) : value;
  return parsedValue.isNeg()
    ? `-€${parsedValue.neg().toFixed(2)}`
    : `€${parsedValue.toFixed(2)}`;
}
