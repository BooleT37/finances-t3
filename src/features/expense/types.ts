import { type Dayjs } from "dayjs";
import type Subscription from "../subscription/Subscription";

export interface SubscriptionForPeriod {
  subscription: Subscription;
  firstDate: Dayjs;
}
