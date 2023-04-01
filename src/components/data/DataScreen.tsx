import {
  ClockCircleOutlined,
  InfoCircleOutlined,
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { AgGridReact } from "ag-grid-react";
import { Button, Checkbox, DatePicker, Input, Space, Tooltip } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { action } from "mobx";
import { observer } from "mobx-react";
import React, { useCallback } from "react";
import styled from "styled-components";
import { AG_GRID_LOCALE_RU } from "~/agGridLocale.ru";
import type Expense from "~/models/Expense";
import { type TableData } from "~/models/Expense";
import expenseStore from "~/stores/expenseStore";
import forecastStore from "~/stores/forecastStore";
import { DATE_FORMAT, MONTH_DATE_FORMAT } from "~/utils/constants";
import { DataScreenDataFetcher } from "./DataScreenDataFetcher";
import ExpenseModal from "./ExpenseModal";
import expenseModalViewModel from "./ExpenseModal/expenseModalViewModel";
import autoGroupColumnDef from "./gridColumnDefs/autoGroupColumnDef";
import columnDefs from "./gridColumnDefs/columnDefs";
import { getRowStyle } from "./utils";

const { RangePicker } = DatePicker;
const { Search } = Input;

const today = dayjs();

const DateTypeButton = styled(Button)`
  padding-left: 0;
`;

const SearchStyled = styled(Search)`
  position: absolute;
  right: 50px;
  width: 300px;
`;

const AgGridStyled = styled(AgGridReact<TableData>)`
  .data-row-upcoming-subscription {
    color: darkgray;
  }
`;

export interface DataTableContext {
  expandCategory(category: string): void;
  categoriesForecast: Record<number, number>;
  passedDaysRatio: number | null;
  savingSpendingsForecast: number;
}

const DataScreen = observer(function DataScreen() {
  const [rangeStart, setRangeStart] = React.useState<Dayjs | null>(
    today.startOf("day").date(1)
  );
  const [rangeEnd, setRangeEnd] = React.useState<Dayjs | null>(
    today.endOf("day").add(1, "month").date(1).subtract(1, "day")
  );
  const gridRef = React.useRef<AgGridReact>(null);
  const [isRangePicker, setIsRangePicker] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [upcSubscriptionsShown, setUpcSubscriptionsShown] =
    React.useState(false);

  const handleRangeChange = (
    _dates: [Dayjs | null, Dayjs | null] | null,
    dateStrings: [string, string] | null
  ) => {
    setRangeStart(
      dateStrings && dateStrings[0] ? dayjs(dateStrings[0], DATE_FORMAT) : null
    );
    setRangeEnd(
      dateStrings && dateStrings[1]
        ? dayjs(dateStrings[1], DATE_FORMAT).endOf("day")
        : null
    );
  };

  const handleMonthChange = (date: Dayjs | null) => {
    setRangeStart(date ? date.startOf("day").date(1) : null);
    setRangeEnd(
      date ? date.endOf("day").add(1, "month").subtract(1, "day") : null
    );
  };

  const expandCategory = React.useCallback((category: string) => {
    setTimeout(() => {
      if (!gridRef.current) {
        return;
      }
      gridRef.current.api.forEachNode((node) => {
        if (node.key === category) {
          node.setExpanded(true);
        }
      });
    }, 0);
  }, []);

  const handleAdd = action(() => {
    expenseModalViewModel.open(null);
  });

  const goToPrevMonth = () => {
    setRangeStart((d) => {
      if (!d) {
        return d;
      }
      return d.clone().subtract(1, "month");
    });
    setRangeEnd((d) => {
      if (!d) {
        return d;
      }
      return d.clone().set("date", 1).subtract(1, "day");
    });
  };

  const goToNextMonth = () => {
    setRangeStart((d) => {
      if (!d) {
        return d;
      }
      return d.clone().add(1, "month");
    });
    setRangeEnd((d) => {
      if (!d) {
        return d;
      }
      return d.clone().add(2, "month").set("date", 1).subtract(1, "day");
    });
  };

  const { boundaryDates } = expenseStore;

  const setRangeAcrossAllTime = useCallback(() => {
    setRangeStart(boundaryDates[0]);
    setRangeEnd(boundaryDates[1]);
  }, [boundaryDates]);

  const handleSearch = (value: string) => {
    setIsRangePicker(true);
    setRangeAcrossAllTime();
    setSearch(value);
    if (value) {
      setTimeout(() => {
        gridRef.current?.api.expandAll();
      });
    }
  };

  const isCurrentMonth =
    rangeStart &&
    today.month() === rangeStart.month() &&
    today.year() === rangeStart.year();

  const handleModalSubmit = useCallback(
    (expense: Expense) => {
      expandCategory(expense.category.name);
      setTimeout(
        action(() => {
          if (!gridRef.current) {
            return;
          }
          const { api } = gridRef.current;
          const nodeToFlash = api.getRowNode(expense.id.toString());
          if (nodeToFlash) {
            api.flashCells({
              rowNodes: [nodeToFlash],
            });
          }
        }),
        100
      );
    },
    [expandCategory]
  );

  const handleDateTypeButtonClick = useCallback(() => {
    if (isRangePicker && rangeEnd) {
      setRangeEnd(
        rangeEnd.clone().add(1, "month").set("date", 1).subtract(1, "day")
      );
      setRangeStart(rangeEnd.clone().set("date", 1));
    }
    setIsRangePicker((value) => !value);
  }, [isRangePicker, rangeEnd]);

  return (
    <>
      <SearchStyled
        addonBefore={
          <Tooltip
            placement="bottom"
            title={`
                  Поиск ведется по полю "Имя".
                  Поиск всегда идет среди трат за все время.
                  Некоторый исскуственно добавленный текст,
                  который тоже отображается в поле "Имя"
                  (например имя и категория траты из сбережений),
                  в поиске не учитываются`}
          >
            <InfoCircleOutlined />
          </Tooltip>
        }
        placeholder="Найти..."
        onSearch={handleSearch}
        allowClear={true}
      />
      <Space direction="vertical" size="middle">
        <div>
          <Space size="middle">
            {isRangePicker ? (
              <RangePicker
                format={DATE_FORMAT}
                value={[rangeStart, rangeEnd]}
                onChange={handleRangeChange}
                allowClear={false}
              />
            ) : (
              <div>
                <Tooltip title="Предыдущий месяц">
                  <Button
                    type="text"
                    icon={<LeftOutlined />}
                    onClick={goToPrevMonth}
                  />
                </Tooltip>
                <DatePicker
                  value={rangeStart}
                  picker="month"
                  onChange={handleMonthChange}
                  format={MONTH_DATE_FORMAT}
                  allowClear={false}
                />
                <Tooltip title="Следующий месяц">
                  <Button
                    type="text"
                    icon={<RightOutlined />}
                    onClick={goToNextMonth}
                  />
                </Tooltip>
              </div>
            )}
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Добавить
            </Button>
          </Space>
          <br />
          <Space>
            <DateTypeButton
              icon={<SwapOutlined />}
              type="link"
              onClick={handleDateTypeButtonClick}
            >
              {isRangePicker ? "Выбрать только месяц" : "Выбрать точный период"}
            </DateTypeButton>
            {isRangePicker && (
              <Button
                icon={<ClockCircleOutlined />}
                type="link"
                onClick={setRangeAcrossAllTime}
              >
                За все время
              </Button>
            )}
          </Space>
        </div>
        <div>
          <Checkbox
            checked={upcSubscriptionsShown}
            onChange={(e) => setUpcSubscriptionsShown(e.target.checked)}
          >
            Предстоящие подписки
          </Checkbox>
        </div>
        {rangeStart && rangeEnd && (
          <div className="ag-theme-alpine" style={{ width: 800 }}>
            <AgGridStyled
              ref={gridRef}
              rowData={expenseStore.tableData(
                rangeStart,
                rangeEnd,
                search,
                upcSubscriptionsShown
              )}
              getRowClass={({ data }) =>
                data && data.isUpcomingSubscription
                  ? "data-row-upcoming-subscription"
                  : undefined
              }
              defaultColDef={{
                menuTabs: ["generalMenuTab"],
              }}
              columnDefs={columnDefs}
              getRowId={({ data }) => data.id.toString()}
              context={{
                expandCategory,
                categoriesForecast: isRangePicker
                  ? null
                  : forecastStore.categoriesForecast(
                      rangeStart.year(),
                      rangeStart.month()
                    ),
                passedDaysRatio: isRangePicker
                  ? null
                  : isCurrentMonth
                  ? today.date() / rangeStart.daysInMonth()
                  : 1,
                savingSpendingsForecast: expenseStore.savingSpendingsForecast(
                  rangeStart.year(),
                  rangeStart.month()
                ),
              }}
              isGroupOpenByDefault={({ field }) => field === "subcategory"}
              getRowStyle={getRowStyle}
              suppressAggFuncInHeader
              autoGroupColumnDef={autoGroupColumnDef}
              domLayout="autoHeight"
              localeText={AG_GRID_LOCALE_RU}
            />
          </div>
        )}
      </Space>
      <ExpenseModal
        startDate={rangeStart}
        endDate={rangeEnd}
        onSubmit={handleModalSubmit}
      />
    </>
  );
});

export default DataScreen;
