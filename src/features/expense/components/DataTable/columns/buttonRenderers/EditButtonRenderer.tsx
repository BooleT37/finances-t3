import { EditFilled } from "@ant-design/icons";
import { Button } from "antd";
import { type MRT_ColumnDef } from "material-react-table";
import type { ExpenseTableData } from "~/features/expense/Expense";
import { useExpenseModalContext } from "~/features/expense/components/ExpenseModal/expenseModalContext";

const EditButtonRenderer: MRT_ColumnDef<ExpenseTableData>["Cell"] = (props) => {
  const expenseModalContext = useExpenseModalContext();
  // if it's a group row or an upcoming subscription
  if (props.row.original.isUpcomingSubscription) {
    return null;
  }
  const id = props.row.original.id;
  return (
    <Button
      icon={<EditFilled />}
      onClick={() => {
        expenseModalContext.open(id);
      }}
    />
  );
};

export default EditButtonRenderer;
