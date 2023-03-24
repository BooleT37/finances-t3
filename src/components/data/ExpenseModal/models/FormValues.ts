import { type Dayjs } from "dayjs";
import { type PersonalExpCategoryIds } from "~/models/Category";

export default interface FormValues {
  cost: string;
  subscription: number | null;
  date: Dayjs | null;
  category: number | null;
  subcategory: number | null;
  personalExpCategoryId: PersonalExpCategoryIds | null;
  personalExpSpent: string;
  savingSpendingId: number | null;
  savingSpendingCategoryId: number | null;
  name: string;
  source: number | null;
}
