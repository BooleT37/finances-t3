import { type Dayjs } from "dayjs";

export default interface FormValues {
  cost: string;
  subscription: number | undefined;
  date: Dayjs | undefined;
  actualDate: Dayjs | undefined;
  category: number | undefined;
  subcategory: number | undefined;
  savingSpendingId: number | undefined;
  savingSpendingCategoryId: number | undefined;
  name: string;
  source: number | undefined;
}
