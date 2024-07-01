import Decimal from "decimal.js";
import isNil from "lodash/isNil";
import { decimalSum } from "~/utils/decimalSum";

export default function avgForNonEmpty(values: Decimal[]): Decimal {
  if (values.length === 0) {
    return new Decimal(0);
  }
  const filtered = values.filter((value) => !isNil(value));

  return decimalSum(...filtered).div(filtered.length);
}
