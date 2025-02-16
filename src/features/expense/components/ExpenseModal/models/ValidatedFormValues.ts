import { type Dayjs } from "dayjs";
import type FormValues from "./FormValues";

export default interface ValidatedFormValues
  extends Omit<FormValues, "date" | "category"> {
  date: Dayjs;
  category: number;
}
