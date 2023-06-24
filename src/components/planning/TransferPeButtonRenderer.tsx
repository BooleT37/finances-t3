import { RightSquareOutlined } from "@ant-design/icons";
import type { ICellRendererParams } from "ag-grid-community";
import { Button } from "antd";
import React from "react";
import { dataStores } from "~/stores/dataStores";
import type { ForecastTableItem } from "~/stores/ForecastStore/types";
import type { ForecastTableContext } from "./PlanningScreen";

const TransferPeButtonRenderer: React.FC<
  ICellRendererParams<ForecastTableItem>
  // eslint-disable-next-line mobx/missing-observer
> = (props) => {
  const { year, month, scrollToRow } = props.context as ForecastTableContext;
  return (
    <Button
      title="Рассчитать персональные расходы"
      icon={<RightSquareOutlined />}
      onClick={() => {
        if (!props.data) {
          return;
        }
        void dataStores.forecastStore.transferPersonalExpense(
          props.data.categoryId,
          month,
          year
        );
        setTimeout(() => {
          if (props.data) {
            scrollToRow(props.data.categoryId);
          }
        });
      }}
    />
  );
};

export default TransferPeButtonRenderer;
