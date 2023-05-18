import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import type { CellEditRequestEvent, IRowNode } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Button, DatePicker, Space, Tooltip, Typography } from "antd";
import dayjs from "dayjs";
import { action } from "mobx";
import { observer } from "mobx-react";
import React, { useCallback } from "react";
import { AG_GRID_LOCALE_RU } from "~/agGridLocale.ru";
import { dataStores } from "~/stores/dataStores";
import {
  type ForecastSum,
  type ForecastTableItem,
} from "~/stores/ForecastStore/types";
import { MONTH_DATE_FORMAT } from "~/utils/constants";
import columnDefs, { type ForecastSumFromEdit } from "./columnDefs";
import personalExpensesColumnDefs from "./personalExpensesColumnDefs";
import SurplusData from "./SurplusData";

const { Title } = Typography;

export interface ForecastTableContext {
  year: number;
  month: number;
  scrollToRow(categoryId: number): void;
}

export interface ForecastMainTableContext extends ForecastTableContext {
  setForecastSum: (categoryId: number, sum: number) => void;
}

const PlanningScreen = observer(function PlanningScreen() {
  const [date, setDate] = React.useState<dayjs.Dayjs | null>(dayjs());
  const gridRef = React.useRef<AgGridReact<ForecastTableItem>>(null);

  const scrollToRow = useCallback((categoryId: number) => {
    gridRef.current?.api.ensureNodeVisible(
      (node: IRowNode<ForecastTableItem>) =>
        node.data?.categoryId === categoryId,
      "middle"
    );
  }, []);

  const handleCellEditRequest = action(
    (params: CellEditRequestEvent<ForecastTableItem, ForecastSumFromEdit>) => {
      if (!date) {
        return;
      }
      const field = params.column.getColDef().field;
      if (field === "sum") {
        const oldValue = params.oldValue as ForecastSum;
        const newValue = params.newValue as ForecastSumFromEdit;
        if (oldValue.value === newValue.value) {
          return;
        }
        void dataStores.forecastStore.changeForecastSum(
          dataStores.categoriesStore.getById(params.data.categoryId),
          date.month(),
          date.year(),
          newValue.value
        );
      } else if (field === "comment") {
        const oldValue = params.oldValue as string;
        const newValue = params.newValue as string;
        if (oldValue === newValue) {
          return;
        }
        void dataStores.forecastStore.changeForecastComment(
          dataStores.categoriesStore.getById(params.data.categoryId),
          date.month(),
          date.year(),
          newValue
        );
      }
      setTimeout(() => {
        scrollToRow(params.data.categoryId);
      });
    }
  );

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

  const setForecastSum = useCallback(
    (categoryId: number, sum: number) => {
      if (date) {
        void dataStores.forecastStore.changeForecastSum(
          dataStores.categoriesStore.getById(categoryId),
          date.month(),
          date.year(),
          sum
        );
      }
    },
    [date]
  );

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
        {date && (
          <Space direction="vertical" size="middle">
            <div>
              <Title level={2}>Расходы</Title>
              <div className="ag-theme-alpine" style={{ width: 1130 }}>
                <AgGridReact<ForecastTableItem>
                  ref={gridRef}
                  readOnlyEdit
                  onCellEditRequest={handleCellEditRequest}
                  columnDefs={columnDefs}
                  rowData={dataStores.forecastStore.tableData(
                    date.year(),
                    date.month(),
                    false,
                    false,
                    false
                  )}
                  context={
                    {
                      year: date.year(),
                      month: date.month(),
                      scrollToRow,
                      setForecastSum,
                    } as ForecastMainTableContext
                  }
                  domLayout="autoHeight"
                  localeText={AG_GRID_LOCALE_RU}
                />
              </div>
            </div>
            <div>
              <Title level={2}>Сбережения</Title>
              <div className="ag-theme-alpine" style={{ width: 1130 }}>
                <AgGridReact
                  readOnlyEdit
                  onCellEditRequest={handleCellEditRequest}
                  columnDefs={columnDefs}
                  rowData={dataStores.forecastStore.tableData(
                    date.year(),
                    date.month(),
                    false,
                    false,
                    true
                  )}
                  domLayout="autoHeight"
                  context={
                    {
                      year: date.year(),
                      month: date.month(),
                      scrollToRow,
                    } as ForecastTableContext
                  }
                  localeText={AG_GRID_LOCALE_RU}
                />
              </div>
            </div>
            <div>
              <Title level={2}>Личные Расходы</Title>
              <div className="ag-theme-alpine" style={{ width: 1200 }}>
                <AgGridReact<ForecastTableItem>
                  ref={gridRef}
                  readOnlyEdit
                  onCellEditRequest={handleCellEditRequest}
                  columnDefs={personalExpensesColumnDefs}
                  rowData={dataStores.forecastStore.tableData(
                    date.year(),
                    date.month(),
                    false,
                    true,
                    false
                  )}
                  context={
                    {
                      year: date.year(),
                      month: date.month(),
                      scrollToRow,
                    } as ForecastTableContext
                  }
                  domLayout="autoHeight"
                  localeText={AG_GRID_LOCALE_RU}
                />
              </div>
            </div>
            <div>
              <Title level={2}>Доходы</Title>
              <div className="ag-theme-alpine" style={{ width: 1130 }}>
                <AgGridReact
                  readOnlyEdit
                  onCellEditRequest={handleCellEditRequest}
                  columnDefs={columnDefs}
                  rowData={dataStores.forecastStore.tableData(
                    date.year(),
                    date.month(),
                    true,
                    false,
                    false
                  )}
                  domLayout="autoHeight"
                  context={
                    {
                      year: date.year(),
                      month: date.month(),
                      scrollToRow,
                    } as ForecastTableContext
                  }
                  localeText={AG_GRID_LOCALE_RU}
                />
              </div>
            </div>
            <SurplusData month={date.month()} year={date.year()} />
          </Space>
        )}
      </Space>
    </>
  );
});

export default PlanningScreen;
