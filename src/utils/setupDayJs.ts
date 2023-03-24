import dayjs from "dayjs";
import "dayjs/locale/ru";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import minMax from "dayjs/plugin/minMax";

export default function setupDayJs() {
  dayjs.extend(customParseFormat);
  dayjs.extend(isSameOrAfter);
  dayjs.extend(isSameOrBefore);
  dayjs.extend(quarterOfYear);
  dayjs.extend(isBetween);
  dayjs.extend(minMax);
  dayjs.locale("ru");
}
