import { type Dayjs } from "dayjs";
import { type PersonalExpCategoryIds } from "~/models/Category";

export default interface FormValues {
  cost: string;
  subscription: number | undefined;
  date: Dayjs | undefined;
  category: number | undefined;
  subcategory: number | undefined;
  personalExpCategoryId: PersonalExpCategoryIds | undefined;
  personalExpSpent: string;
  savingSpendingId: number | undefined;
  savingSpendingCategoryId: number | undefined;
  name: string;
  source: number | undefined;
}
