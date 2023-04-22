import { type AgChartOptions } from "ag-charts-community";
import { AgChartsReact } from "ag-charts-react";
import { DatePicker, Select, Space, Typography } from "antd";
import dayjs from "dayjs";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";
import categoriesStore from "~/stores/categoriesStore";
import expenseStore from "~/stores/expenseStore";
import { MONTH_DATE_FORMAT } from "~/utils/constants";
import getOptions from "./getOptions";

const { RangePicker } = DatePicker;
const { Title } = Typography;

const thisMonth = dayjs().date(1);

const SelectStyled = styled(Select)`
  width: 400px;
`;

const DynamicsChart = observer(function DynamicsChart() {
  const [startDate, setStartDate] = React.useState<dayjs.Dayjs>(() =>
    thisMonth.clone().subtract(1, "year")
  );
  const [endDate, setEndDate] = React.useState<dayjs.Dayjs>(() =>
    thisMonth.clone()
  );
  const [categoriesIds, setCategoriesIds] = React.useState<number[]>([]);
  const { options: categoriesOptons } = categoriesStore;

  const datesAreSame = startDate.isSame(endDate, "month");
  const filteredCategories = React.useMemo(() => {
    if (categoriesIds.length === 0) {
      return categoriesStore.categories;
    }
    return categoriesStore.categories.filter((c) =>
      categoriesIds.includes(c.id)
    );
  }, [categoriesIds]);
  const options = React.useMemo(
    () =>
      datesAreSame
        ? ([] as AgChartOptions)
        : getOptions(
            filteredCategories.map((c) => c.id.toString()),
            filteredCategories.map((c) => c.shortname),
            expenseStore.getDynamicsData(startDate, endDate, categoriesIds)
          ),
    [categoriesIds, datesAreSame, endDate, filteredCategories, startDate]
  );

  const handleRangeChange = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  ) => {
    if (!dates || !dates[0] || !dates[1]) {
      return;
    }
    setStartDate(dates[0]);
    setEndDate(dates[1]);
  };

  const ref = React.useRef(null);

  return (
    <div style={{ width: 1200 }}>
      <Title level={3}>Динамика</Title>
      <Space size="middle">
        <RangePicker
          picker="month"
          value={[startDate, endDate]}
          onChange={handleRangeChange}
          format={MONTH_DATE_FORMAT}
          allowClear={false}
        />
        <SelectStyled
          placeholder="Все категории"
          mode="multiple"
          options={categoriesOptons}
          value={categoriesIds}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          /* @ts-ignore bug in styled-components*/
          onChange={setCategoriesIds}
        />
      </Space>
      <AgChartsReact ref={ref} options={options} />
    </div>
  );
});

export default DynamicsChart;
