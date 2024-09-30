import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, DatePicker, Space, Tooltip } from "antd";
import dayjs from "dayjs";
import type Decimal from "decimal.js";
import React from "react";
import { MONTH_DATE_FORMAT } from "~/utils/constants";
import PlanningTable from "./PlanningTable/PlanningTable";

export interface ForecastTableContext {
  year: number;
  month: number;
  scrollToRow(categoryId: number): void;
}

export interface ForecastMainTableContext extends ForecastTableContext {
  setForecastSum: (categoryId: number, sum: Decimal) => void;
}

// eslint-disable-next-line mobx/missing-observer
const PlanningScreen = () => {
  const [date, setDate] = React.useState<dayjs.Dayjs | null>(dayjs());

  const goToPrevMonth = () => {
    setDate((d) => {
      if (!d) {
        return d;
      }
      return d.clone().subtract(1, "month");
    });
  };

  const goToNextMonth = () => {
    setDate((d) => {
      if (!d) {
        return d;
      }
      return d.clone().add(1, "month");
    });
  };

  return (
    <>
      <Space direction="vertical" size="middle">
        <div>
          <Tooltip title="Предыдущий месяц">
            <Button
              type="text"
              size="large"
              icon={<LeftOutlined />}
              onClick={goToPrevMonth}
            />
          </Tooltip>
          <DatePicker
            value={date}
            picker="month"
            onChange={(date) => setDate(date)}
            format={MONTH_DATE_FORMAT}
            allowClear={false}
            style={{ width: 160 }}
            size="large"
          />
          <Tooltip title="Следующий месяц">
            <Button
              type="text"
              size="large"
              icon={<RightOutlined />}
              onClick={goToNextMonth}
            />
          </Tooltip>
        </div>
        {date && <PlanningTable month={date.month()} year={date.year()} />}
      </Space>
    </>
  );
};

export default PlanningScreen;
