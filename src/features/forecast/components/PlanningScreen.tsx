import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, DatePicker, Space, Tooltip } from "antd";
import type dayjs from "dayjs";
import type Decimal from "decimal.js";
import React from "react";
import { styled } from "styled-components";
import { MONTH_DATE_FORMAT } from "~/utils/constants";
import PlanningTable from "./PlanningTable/PlanningTable";
import { getToday } from "~/utils/today";

export const PLANNING_SCREEN_SPACE_GAP = 16;
const SpaceStyled = styled(Space)`
  --planning-screen-header-height: 40px;
  max-width: 100%;
`;

const HeaderStyled = styled.div`
  height: var(--planning-screen-header-height);
`;

export interface ForecastTableContext {
  year: number;
  month: number;
  scrollToRow(categoryId: number): void;
}

export interface ForecastMainTableContext extends ForecastTableContext {
  setForecastSum: (categoryId: number, sum: Decimal) => void;
}

const PlanningScreen = () => {
  const [date, setDate] = React.useState<dayjs.Dayjs | null>(getToday());

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
      <SpaceStyled direction="vertical" size={PLANNING_SCREEN_SPACE_GAP}>
        <HeaderStyled>
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
        </HeaderStyled>
        {date && <PlanningTable month={date.month()} year={date.year()} />}
      </SpaceStyled>
    </>
  );
};

export default PlanningScreen;
