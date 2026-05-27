import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  eachDayOfInterval,
  eachWeekOfInterval,
  addDays,
  format,
  getMonth,
  getQuarter,
  getYear,
  getWeek,
} from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import type { WeeklyDataItem, ChartDataItem } from "@/types/income-expense-bar-chart";
import type { MainPeriod, SubPeriod } from "@/constants/charts";

const VN_TIMEZONE = "Asia/Ho_Chi_Minh";

export function formatLocalDate(d: Date): string {
  return formatInTimeZone(d, VN_TIMEZONE, "yyyy-MM-dd");
}

export function generateLabels(
  startDate: Date,
  endDate: Date,
  subPeriod: SubPeriod,
  _mainPeriod: MainPeriod
): ChartDataItem[] {
  const labels: ChartDataItem[] = [];

  switch (subPeriod) {
    case "day":
    case "thisWeek": {
      eachDayOfInterval({ start: startDate, end: endDate }).forEach((day) => {
        labels.push({ label: format(day, "dd/MM"), startDate: day, endDate: day });
      });
      break;
    }
    case "week": {
      eachWeekOfInterval({ start: startDate, end: endDate }, { weekStartsOn: 1 }).forEach((weekStart) => {
        const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
        const effectiveEnd = weekEnd > endDate ? endDate : weekEnd;
        labels.push({
          label: `${format(weekStart, "dd/MM")} - ${format(effectiveEnd, "dd/MM")}`,
          startDate: weekStart,
          endDate: effectiveEnd,
        });
      });
      break;
    }
    case "month": {
      let current = startOfMonth(startDate);
      const last = endOfMonth(endDate);
      while (current <= last) {
        const monthEnd = endOfMonth(current);
        const monthNum = getMonth(current) + 1;
        labels.push({
          label: `T${monthNum}`,
          startDate: current,
          endDate: monthEnd > endDate ? endDate : monthEnd,
        });
        current = startOfMonth(addDays(monthEnd, 1));
      }
      break;
    }
    case "quarter": {
      let year = getYear(startDate);
      const endYear = getYear(endDate);
      while (year <= endYear) {
        for (let q = 1; q <= 4; q++) {
          const qStart = startOfQuarter(new Date(year, (q - 1) * 3, 1));
          const qEnd = endOfQuarter(new Date(year, (q - 1) * 3, 1));
          if (qStart <= endDate && qEnd >= startDate) {
            labels.push({
              label: `Q${q}`,
              startDate: qStart < startDate ? startDate : qStart,
              endDate: qEnd > endDate ? endDate : qEnd,
            });
          }
        }
        year++;
      }
      break;
    }
  }

  return labels;
}

export function aggregateDataByLabels(
  apiData: WeeklyDataItem[],
  labels: ChartDataItem[],
  subPeriod: SubPeriod
): WeeklyDataItem[] {
  if (!apiData?.length) {
    return labels.map((l) => ({ week: l.label, income: 0, expense: 0 }));
  }

  const apiDataWithDateStr = apiData.map((d) => ({
    ...d,
    _dateStr: d.date || d.day || d.week || "",
    // Ensure positive values for chart display
    income: Math.abs(d.income || 0),
    expense: Math.abs(d.expense || 0),
  }));

  const toFiniteNumber = (value: unknown): number => {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  };

  return labels.map((labelItem) => {
    // Use local date format (YYYY-MM-DD) instead of UTC toISOString
    const labelDateStr = formatLocalDate(labelItem.startDate);

    const match = apiDataWithDateStr.find((d) => {
      if (subPeriod === "day" || subPeriod === "thisWeek") {
        return d._dateStr === labelDateStr;
      }
      if (subPeriod === "week") {
        const dataWeek = d._week || d.week?.replace("T", "");
        return dataWeek === getWeek(labelItem.startDate, { weekStartsOn: 1 });
      }
      if (subPeriod === "month") {
        const dataMonth = d.month || d.week;
        if (dataMonth) {
          const monthNum = getMonth(labelItem.startDate) + 1;
          return dataMonth.includes(String(monthNum)) || dataMonth === `T${monthNum}`;
        }
      }
      if (subPeriod === "quarter") {
        const dataQuarter = d.quarter || d.week;
        if (dataQuarter) {
          return dataQuarter === `Q${getQuarter(labelItem.startDate)}`;
        }
      }
      return false;
    });

    const income = Math.abs(toFiniteNumber(match?.income));
    const expense = Math.abs(toFiniteNumber(match?.expense));

    return { week: labelItem.label, income, expense };
  });
}
