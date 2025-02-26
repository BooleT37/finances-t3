import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, DatePicker, Space, Tooltip } from "antd";
import type Decimal from "decimal.js";
import { styled } from "styled-components";
import { useDateStore } from "~/stores/dateStore";
import { MONTH_DATE_FORMAT } from "~/utils/constants";
import PlanningTable from "./PlanningTable/PlanningTable";

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
  const { selectedDate, setSelectedDate, goToPrevMonth, goToNextMonth } =
    useDateStore();

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
            value={selectedDate}
            picker="month"
            onChange={(date) => setSelectedDate(date ?? selectedDate)}
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
        <PlanningTable
          month={selectedDate.month()}
          year={selectedDate.year()}
        />
      </SpaceStyled>
    </>
  );
};

export default PlanningScreen;
