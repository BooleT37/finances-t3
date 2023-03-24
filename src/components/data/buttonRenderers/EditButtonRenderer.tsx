import { EditFilled } from "@ant-design/icons";
import { type ICellRendererParams } from "ag-grid-enterprise";
import { Button } from "antd";
import React from "react";
import { type TableData } from "~/models/Expense";
import expenseModalViewModel from "../ExpenseModal/expenseModalViewModel";

// eslint-disable-next-line mobx/missing-observer
const EditButtonRenderer: React.FC<ICellRendererParams<TableData>> = (
  props
) => {
  // if it's a group row or an upcoming subscription
  if (!props.data || props.data.isUpcomingSubscription) {
    return null;
  }
  const id = props.data.id;
  return (
    <Button
      icon={<EditFilled />}
      onClick={() => {
        expenseModalViewModel.open(id);
      }}
    />
  );
};

export default EditButtonRenderer;
