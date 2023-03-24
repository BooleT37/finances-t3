import { type Dayjs } from "dayjs";
import sum from "lodash/sum";

export default function countUniqueMonths(dates: Dayjs[]): number {
  const map: Record<number, Set<number>> = {};

  dates.forEach((date) => {
    const year = date.year();
    const month = date.month();
    const set = map[year];
    if (set === undefined) {
      map[year] = new Set<number>([month]);
    } else {
      set.add(month);
    }
  });
  return sum(Object.values(map).map((months) => months.size));
}
