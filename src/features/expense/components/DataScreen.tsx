import {
  ClockCircleOutlined,
  ImportOutlined,
  InfoCircleOutlined,
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  Space,
  Spin,
  Tooltip,
} from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { type MRT_TableInstance } from "material-react-table";
import React, { useCallback, useRef } from "react";
import styled from "styled-components";
import { useGetCategoryById } from "~/features/category/facets/categoryById";
import type { ExpenseTableData } from "~/features/expense/Expense";
import { useBoundaryDates } from "~/features/expense/facets/expenseBoundaries";
import { useGetExpenseTableData } from "~/features/expense/facets/expenseTableData";
import { useUserSettings } from "~/features/userSettings/facets/allUserSettings";
import { useDateStore } from "~/stores/dateStore";
import { DATE_FORMAT, MONTH_DATE_FORMAT } from "~/utils/constants";
import type { ExpenseFromApi } from "../api/types";
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

const DateTypeButton = styled(Button)`
  padding-left: 0;
`;

const SearchStyled = styled(Search)`
  position: absolute;
  right: 50px;
  width: 300px;
`;

const DataScreen = () => {
  const {
    selectedDate,
    rangeEnd,
    isRangePicker,
    setSelectedDate,
    setRangeEnd,
    setIsRangePicker,
    goToPrevMonth,
    goToNextMonth,
    setDateRange,
    setRangeAcrossAllTime: setStoreRangeAcrossAllTime,
  } = useDateStore();

  const [search, setSearch] = React.useState("");
  const [upcSubscriptionsShown, setUpcSubscriptionsShown] =
    React.useState(false);
  const [groupBySubcategories, setGroupBySubcategories] = React.useState(false);
  const importModalContext = useImportModalContext();
  const expenseModalContext = useExpenseModalContext();
  const getExpenseTableData = useGetExpenseTableData();
  const getCategoryById = useGetCategoryById();

  const handleRangeChange = (
    _dates: [Dayjs | null, Dayjs | null] | null,
    dateStrings: [string, string] | null
  ) => {
    const start = dateStrings?.[0] ? dayjs(dateStrings[0], DATE_FORMAT) : null;
    const end = dateStrings?.[1]
      ? dayjs(dateStrings[1], DATE_FORMAT).endOf("day")
      : null;

    if (start && end) {
      setDateRange(start, end);
    }
  };

  const handleMonthChange = (date: Dayjs | null) => {
    if (date !== null) {
      setSelectedDate(date.startOf("day").date(1));
      setRangeEnd(date.endOf("day").add(1, "month").date(1).subtract(1, "day"));
    }
  };

  const handleAdd = () => {
    expenseModalContext.open(null);
  };

  const handleImport = () => {
    importModalContext.open();
  };

  const boundaryDates = useBoundaryDates();

  const setRangeAcrossAllTime = useCallback(() => {
    setStoreRangeAcrossAllTime(boundaryDates[0], boundaryDates[1]);
  }, [boundaryDates, setStoreRangeAcrossAllTime]);

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
    (expense: ExpenseFromApi) => {
      if (!getCategoryById.loaded) {
        return;
      }
      const category = getCategoryById.getCategoryById(expense.categoryId);
      expandCategory(category.name);
    },
    [expandCategory, getCategoryById]
  );

  const handleDateTypeButtonClick = useCallback(() => {
    if (isRangePicker) {
      setIsRangePicker(false);
      setRangeEnd(
        selectedDate.clone().add(1, "month").set("date", 1).subtract(1, "day")
      );
    } else {
      setIsRangePicker(true);
    }
  }, [isRangePicker, selectedDate, setIsRangePicker, setRangeEnd]);

  const { isSuccess: userSettingsLoaded } = useUserSettings();

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
                value={[selectedDate, rangeEnd]}
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
                  value={selectedDate}
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
        {/* 
          // we need to fetch all the orders from user settings
          // before we render the table, otherwise ordering won't work */}
        {userSettingsLoaded ? (
          <DataTable
            tableInstanceRef={tableInstanceRef}
            data={getExpenseTableData({
              startDate: selectedDate,
              endDate: rangeEnd,
              searchString: search,
              includeUpcomingSubscriptions: upcSubscriptionsShown,
            })}
            groupBySubcategories={groupBySubcategories}
            currentMonth={selectedDate.month()}
            currentYear={selectedDate.year()}
            isRangePicker={isRangePicker}
          />
        ) : (
          <Spin />
        )}
      </Space>
      <ExpenseModal
        startDate={selectedDate}
        endDate={rangeEnd}
        onSubmit={handleModalSubmit}
      />
      <ImportModal />
      {importModalContext.parsedExpenses && (
        <ParsedExpensesModal
          parsedExpenses={importModalContext.parsedExpenses}
        />
      )}
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
