import { Tooltip, Typography } from "antd";
import { observer } from "mobx-react";
import React from "react";
import { dataStores } from "~/stores/dataStores";
import costToString from "~/utils/costToString";

const { Title } = Typography;

interface Props {
  year: number;
  month: number;
}

const SurplusData: React.FC<Props> = observer(function ({ year, month }) {
  return (
    <div>
      <Title level={4}>Разница в этом месяце:</Title>
      <div>
        <Tooltip title="Планируемые доходы минус планируемые расходы">
          По плану: &nbsp;
        </Tooltip>
        {costToString(
          dataStores.forecastStore
            .totalForMonth(year, month, true)
            .minus(dataStores.forecastStore.totalForMonth(year, month, false))
        )}
      </div>
      <div>
        <Tooltip title="Фактические доходы минус фактические расходы">
          Факт: &nbsp;
        </Tooltip>
        {costToString(
          dataStores.expenseStore
            .totalPerMonth({
              year,
              month,
              isIncome: true,
            })
            .minus(
              dataStores.expenseStore.totalPerMonth({
                year,
                month,
                isIncome: false,
                excludeTypes: ["FROM_SAVINGS"],
              })
            )
        )}
      </div>
    </div>
  );
});

export default SurplusData;
