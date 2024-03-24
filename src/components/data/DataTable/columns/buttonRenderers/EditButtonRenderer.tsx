import { EditFilled } from "@ant-design/icons";
import { Button } from "antd";
import { type MRT_ColumnDef } from "material-react-table";
import expenseModalViewModel from "~/components/data/ExpenseModal/expenseModalViewModel";
import { type TableData } from "~/models/Expense";

// eslint-disable-next-line mobx/missing-observer
const EditButtonRenderer: MRT_ColumnDef<TableData>["Cell"] = (props) => {
  // if it's a group row or an upcoming subscription
  if (props.row.original.isUpcomingSubscription) {
    return null;
  }
  const id = props.row.original.id;
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
