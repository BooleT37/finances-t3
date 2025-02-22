import {
  ClockCircleOutlined,
  ImportOutlined,
  InfoCircleOutlined,
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, DatePicker, Input, Space, Tooltip } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { type MRT_TableInstance } from "material-react-table";
import React, { useCallback, useRef } from "react";
import styled from "styled-components";
import type Expense from "~/features/expense/Expense";
import type { ExpenseTableData } from "~/features/expense/Expense";
import { useBoundaryDates } from "~/features/expense/facets/expenseBoundaries";
import { useGetExpenseTableData } from "~/features/expense/facets/expenseTableData";
import { DATE_FORMAT, MONTH_DATE_FORMAT } from "~/utils/constants";
import { getToday } from "~/utils/today";
import { DataTable } from "./DataTable/DataTable";
import ExpenseModal from "./ExpenseModal";
import {
  ExpenseModalContextProvider,
  useExpenseModalContext,
} from "./ExpenseModal/expenseModalContext";
import { ImportModal } from "./ImportModal/ImportModal";
import {
  ImportModalContextProvider,
  useImportModalContext,
} from "./ImportModal/importModalContext";
import { ParsedExpensesModal } from "./ImportModal/ParsedExpensesModal";

const { RangePicker } = DatePicker;
const { Search } = Input;

const today = getToday();

const DateTypeButton = styled(Button)`
  padding-left: 0;
`;

const SearchStyled = styled(Search)`
  position: absolute;
  right: 50px;
  width: 300px;
`;

const DataScreen = () => {
  const [rangeStart, setRangeStart] = React.useState<Dayjs | null>(
    today.startOf("day").date(1)
  );
  const [rangeEnd, setRangeEnd] = React.useState<Dayjs | null>(
    today.endOf("day").add(1, "month").date(1).subtract(1, "day")
  );
  const [isRangePicker, setIsRangePicker] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [upcSubscriptionsShown, setUpcSubscriptionsShown] =
    React.useState(false);
  const [groupBySubcategories, setGroupBySubcategories] = React.useState(false);
  const importModalContext = useImportModalContext();
  const expenseModalContext = useExpenseModalContext();
  const getExpenseTableData = useGetExpenseTableData();

  const handleRangeChange = (
    _dates: [Dayjs | null, Dayjs | null] | null,
    dateStrings: [string, string] | null
  ) => {
    setRangeStart(dateStrings?.[0] ? dayjs(dateStrings[0], DATE_FORMAT) : null);
    setRangeEnd(
      dateStrings?.[1] ? dayjs(dateStrings[1], DATE_FORMAT).endOf("day") : null
    );
  };

  const handleMonthChange = (date: Dayjs | null) => {
    setRangeStart(date ? date.startOf("day").date(1) : null);
    setRangeEnd(
      date ? date.endOf("day").add(1, "month").subtract(1, "day") : null
    );
  };

  const handleAdd = () => {
    expenseModalContext.open(null);
  };

  const handleImport = () => {
    importModalContext.open();
  };

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

  const boundaryDates = useBoundaryDates();

  const setRangeAcrossAllTime = useCallback(() => {
    setRangeStart(boundaryDates[0]);
    setRangeEnd(boundaryDates[1]);
  }, [boundaryDates]);

  const tableInstanceRef = useRef<MRT_TableInstance<ExpenseTableData> | null>(
    null
  );

  const expandCategory = React.useCallback((category: string) => {
    setTimeout(() => {
      if (!tableInstanceRef.current) {
        return;
      }

      try {
        tableInstanceRef.current
          .getRow(`category:${category}`)
          .toggleExpanded(true);
      } catch {
        // строка может и не существовать
      }
    }, 0);
  }, []);

  const handleSearch = (value: string) => {
    setIsRangePicker(true);
    setRangeAcrossAllTime();
    setSearch(value);
    if (value) {
      setTimeout(() => {
        tableInstanceRef.current?.toggleAllRowsExpanded(true);
      });
    }
  };

  const handleModalSubmit = useCallback(
    (expense: Expense) => {
      expandCategory(expense.category.name);
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
            <Space size="small">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                Добавить
              </Button>
              <Tooltip title="Импорт">
                <Button icon={<ImportOutlined />} onClick={handleImport} />
              </Tooltip>
            </Space>
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
        <Space>
          <Checkbox
            checked={upcSubscriptionsShown}
            onChange={(e) => setUpcSubscriptionsShown(e.target.checked)}
          >
            Предстоящие подписки
          </Checkbox>
          <Checkbox
            checked={groupBySubcategories}
            onChange={(e) => setGroupBySubcategories(e.target.checked)}
          >
            Сгруппировать по подкатегориям
          </Checkbox>
        </Space>
        {rangeStart && rangeEnd && (
          <DataTable
            tableInstanceRef={tableInstanceRef}
            data={getExpenseTableData({
              startDate: rangeStart,
              endDate: rangeEnd,
              searchString: search,
              includeUpcomingSubscriptions: upcSubscriptionsShown,
            })}
            groupBySubcategories={groupBySubcategories}
            currentMonth={rangeStart.month()}
            currentYear={rangeStart.year()}
            isRangePicker={isRangePicker}
          />
        )}
      </Space>
      <ExpenseModal
        startDate={rangeStart}
        endDate={rangeEnd}
        onSubmit={handleModalSubmit}
      />
      <ImportModal />
      <ParsedExpensesModal />
    </>
  );
};

const DataScreenWithProviders = () => (
  <ImportModalContextProvider>
    <ExpenseModalContextProvider>
      <DataScreen />
    </ExpenseModalContextProvider>
  </ImportModalContextProvider>
);

export default DataScreenWithProviders;
