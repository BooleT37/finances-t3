import { RightSquareOutlined } from "@ant-design/icons";
import { type ICellRendererParams } from "ag-grid-enterprise";
import { Button } from "antd";
import { observer } from "mobx-react";
import React from "react";
import forecastStore from "~/stores/forecastStore";
import type { ForecastTableItem } from "~/stores/forecastStore/types";
import type { ForecastTableContext } from "./PlanningScreen";

// eslint-disable-next-line mobx/missing-observer
const TransferPeButtonRenderer: React.FC<
  ICellRendererParams<ForecastTableItem>
> = observer((props) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { year, month, scrollToRow } = props.context as ForecastTableContext;
  return (
    <Button
      title="Рассчитать персональные расходы"
      icon={<RightSquareOutlined />}
      onClick={() => {
        if (!props.data) {
          return;
        }
        void forecastStore.transferPersonalExpense(
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
});

export default TransferPeButtonRenderer;
