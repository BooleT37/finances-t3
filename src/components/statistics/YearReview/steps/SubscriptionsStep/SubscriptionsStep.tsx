import { Checkbox, Space, Typography } from "antd";
import { groupBy } from "lodash";
import { observer } from "mobx-react";
import { useState } from "react";
import { dataStores } from "~/stores/dataStores";

import { decimalSum } from "~/utils/decimalSum";
import {
  SubscriptionsChart,
  type SubscriptionDatum,
} from "./SubscriptionsChart";

const { Title } = Typography;

export const SubscriptionsStep: React.FC = observer(
  function SubscriptionsStep() {
    const [rentShown, setRentShown] = useState(false);
    const [thisYearByCategories, setThisYearByCategories] = useState(true);
    const [nextYearByCategories, setNextYearByCategories] = useState(true);
    const { expenses } = dataStores.expenseStore;
    const { activeSubscriptions } = dataStores.subscriptionStore;
    const thisYearExpenses = expenses.filter(
      (e) =>
        (rentShown || e.category.name !== "Аренда") &&
        e.date.year() === 2022 &&
        e.subscription != null
    );

    const filteredActiveSubscriptions = activeSubscriptions.filter(
      (s) => rentShown || s.category.name !== "Аренда"
    );

    const thisYearDataByCategories: SubscriptionDatum[] = Object.entries(
      groupBy(thisYearExpenses, "category.id")
    )
      .map(([categoryId, expenses]) => ({
        name: dataStores.categoriesStore.getById(parseInt(categoryId)).name,
        spent: decimalSum(...expenses.map((e) => e.cost ?? 0)).toNumber(),
      }))
      .sort((d1, d2) => d2.spent - d1.spent);

    const thisYearDataBySubscriptions: SubscriptionDatum[] = Object.entries(
      groupBy(thisYearExpenses, "name")
    )
      .map(([name, expenses]) => ({
        name,
        spent: decimalSum(...expenses.map((e) => e.cost ?? 0)).toNumber(),
      }))
      .sort((d1, d2) => d2.spent - d1.spent);

    const nextYearForecastByCategories: SubscriptionDatum[] = Object.entries(
      groupBy(filteredActiveSubscriptions, "category.id")
    )
      .map(([categoryId, subscriptions]) => ({
        name: dataStores.categoriesStore.getById(parseInt(categoryId)).name,
        spent: decimalSum(
          ...subscriptions.map((s) => s.costPerMonth.times(12))
        ).toNumber(),
      }))
      .sort((d1, d2) => d2.spent - d1.spent);

    const nextYearForecastBySubscriptions: SubscriptionDatum[] = Object.entries(
      groupBy(filteredActiveSubscriptions, "name")
    )
      .map(([name, subscriptions]) => ({
        name,
        spent: decimalSum(
          ...subscriptions.map((s) => s.costPerMonth.times(12))
        ).toNumber(),
      }))
      .sort((d1, d2) => d2.spent - d1.spent);

    return (
      <div>
        <Title level={3}>Подписки</Title>
        <Space direction="vertical">
          <Checkbox
            checked={rentShown}
            onChange={(e) => {
              setRentShown(e.target.checked);
            }}
          >
            Показать аренду
          </Checkbox>
          <div>
            <Checkbox
              checked={thisYearByCategories}
              onChange={(e) => {
                setThisYearByCategories(e.target.checked);
              }}
            >
              Сгруппировать по категориям
            </Checkbox>
            {thisYearByCategories ? (
              <SubscriptionsChart
                title="Потрачено в этом году по категориям"
                yName="Потрачено"
                data={thisYearDataByCategories}
              />
            ) : (
              <SubscriptionsChart
                title="Потрачено в этом году по подпискам"
                yName="Потрачено"
                data={thisYearDataBySubscriptions}
              />
            )}
          </div>
          <div>
            <Checkbox
              checked={nextYearByCategories}
              onChange={(e) => {
                setNextYearByCategories(e.target.checked);
              }}
            >
              Сгруппировать по категориям
            </Checkbox>
            {nextYearByCategories ? (
              <SubscriptionsChart
                title="Прогноз на следующий год по категориям"
                yName="Прогноз"
                data={nextYearForecastByCategories}
              />
            ) : (
              <SubscriptionsChart
                title="Прогноз на следующий год по подпискам"
                yName="Прогноз"
                data={nextYearForecastBySubscriptions}
              />
            )}
          </div>
        </Space>
      </div>
    );
  }
);
