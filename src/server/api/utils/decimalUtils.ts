import type { Prisma } from "@prisma/client";
import type { DecimalJsLike } from "@prisma/client/runtime";
import Decimal from "decimal.js";

function isDecimalJsLike(
  value: string | number | Decimal | DecimalJsLike
): value is DecimalJsLike {
  return (
    typeof value === "object" && "s" in value && "e" in value && "d" in value
  );
}

export function isNegative(value: string | number | Decimal | DecimalJsLike) {
  if (isDecimalJsLike(value)) {
    return value.s === -1;
  }
  return new Decimal(value).isNegative();
}

export function isDecimalFieldUpdateOperationsInput(
  value: unknown
): value is Prisma.DecimalFieldUpdateOperationsInput {
  return typeof value === "object" && value !== null && "set" in value;
}
