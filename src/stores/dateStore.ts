import { type Dayjs } from "dayjs";
import { create } from "zustand";
import { getToday } from "~/utils/today";

const today = getToday();

interface DateState {
  // Selected month date (first day of month)
  selectedDate: Dayjs;
  // Range end date (for DataScreen)
  rangeEnd: Dayjs;
  // Whether to use range picker or month picker
  isRangePicker: boolean;

  // Actions
  setSelectedDate: (date: Dayjs) => void;
  setRangeEnd: (date: Dayjs) => void;
  setIsRangePicker: (isRange: boolean) => void;

  // Navigation helpers
  goToPrevMonth: () => void;
  goToNextMonth: () => void;

  // Range helpers
  setDateRange: (start: Dayjs, end: Dayjs) => void;
  setRangeAcrossAllTime: (startDate: Dayjs, endDate: Dayjs) => void;
}

export const useDateStore = create<DateState>((set) => ({
  // Initialize with first day of current month
  selectedDate: today.startOf("day").date(1),
  // Initialize with last day of current month
  rangeEnd: today.endOf("day").add(1, "month").date(1).subtract(1, "day"),
  isRangePicker: false,

  setSelectedDate: (date) => set({ selectedDate: date }),
  setRangeEnd: (date) => set({ rangeEnd: date }),
  setIsRangePicker: (isRange) => set({ isRangePicker: isRange }),

  goToPrevMonth: () =>
    set((state) => ({
      selectedDate: state.selectedDate.clone().subtract(1, "month"),
      rangeEnd: state.selectedDate
        .clone()
        .add(1, "month")
        .date(1)
        .subtract(1, "day"),
      isRangePicker: false,
    })),

  goToNextMonth: () =>
    set((state) => ({
      selectedDate: state.selectedDate.clone().add(1, "month"),
      rangeEnd: state.selectedDate
        .clone()
        .add(2, "month")
        .date(1)
        .subtract(1, "day"),
      isRangePicker: false,
    })),

  setDateRange: (start, end) =>
    set({
      selectedDate: start,
      rangeEnd: end,
    }),

  setRangeAcrossAllTime: (startDate, endDate) =>
    set({
      selectedDate: startDate,
      rangeEnd: endDate,
      isRangePicker: true,
    }),
}));
