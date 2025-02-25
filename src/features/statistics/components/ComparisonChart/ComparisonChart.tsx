import { type AgChartOptions } from "ag-charts-community";
import { AgChartsReact } from "ag-charts-react";
import { DatePicker, Select, Space, Switch, Typography } from "antd";
import type dayjs from "dayjs";
import React from "react";
import { useGetComparisonData } from "~/features/expense/facets/expenseStatistics";
import { MONTH_DATE_FORMAT } from "~/utils/constants";
import { getToday } from "~/utils/today";
import getOptions from "./getOptions";

const { Option } = Select;
const { Title, Text } = Typography;

const thisMonth = getToday().date(1);
const lastMonth = thisMonth.clone().subtract(1, "month");

type Granularity = "month" | "quarter" | "year";
const pickerFormat: Record<Granularity, string> = {
  month: MONTH_DATE_FORMAT,
  quarter: "[Q]Q YYYY",
  year: "YYYY",
};

function dateFormat(
  date1: dayjs.Dayjs,
  date2: dayjs.Dayjs,
  granularity: Granularity
): string {
  if (granularity === "month") {
    if (date1.year() === date2.year()) {
      return "MMMM";
    }
    return MONTH_DATE_FORMAT;
  }
  if (granularity === "quarter") {
    return "[Q]Q";
  }
  return "YYYY";
}

const ComparisonChart = function ComparisonChart() {
  const [startDate, setStartDate] = React.useState<dayjs.Dayjs>(lastMonth);
  const [endDate, setEndDate] = React.useState<dayjs.Dayjs>(thisMonth);
  const [granularity, setGranularity] = React.useState<Granularity>("month");
  const [showIncome, setShowIncome] = React.useState(false);

  const datesAreSame = startDate.isSame(endDate, granularity);
  const format = dateFormat(startDate, endDate, granularity);
  const getComparisonData = useGetComparisonData();

  const options = datesAreSame
    ? ([] as AgChartOptions)
    : getOptions(
        startDate.format(format),
        endDate.format(format),
        getComparisonData(startDate, endDate, granularity, showIncome)
      );

  return (
    <div>
      <Title level={3}>Сравнение с предыдущим периодом</Title>
      <Space size="small">
        <DatePicker
          allowClear={{ clearIcon: false }}
          picker={granularity}
          value={startDate}
          onChange={(d) => {
            setStartDate(d);
          }}
          format={pickerFormat[granularity]}
        />
        -
        <DatePicker
          allowClear={{ clearIcon: false }}
          picker={granularity}
          value={endDate}
          onChange={(d) => {
            setEndDate(d);
          }}
          format={pickerFormat[granularity]}
        />
        <Select value={granularity} onChange={setGranularity}>
          <Option value="month">Месяц</Option>
          <Option value="quarter">Квартал</Option>
          <Option value="year">Год</Option>
        </Select>
        <Space align="center">
          <Switch checked={showIncome} onChange={setShowIncome} />
          <Text>{showIncome ? "Включая доходы" : "Только расходы"}</Text>
        </Space>
      </Space>
      {datesAreSame ? (
        "Пожалуйста, выберите различные периоды в виджете сверху"
      ) : (
        <AgChartsReact options={options} />
      )}
    </div>
  );
};

export default ComparisonChart;
