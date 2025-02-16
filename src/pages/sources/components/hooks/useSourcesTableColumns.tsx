import type { ExpensesParser } from "@prisma/client";
import { createMRTColumnHelper } from "material-react-table";
import { useMemo } from "react";
import type { SourceTableItem } from "~/features/source/Source";
import { ParserHeader } from "./ParserHeader";

interface ParserOption {
  label: string;
  value: ExpensesParser;
}

const parsersOptions: ParserOption[] = [
  {
    label: "Vivid",
    value: "VIVID",
  },
];

const columnHelper = createMRTColumnHelper<SourceTableItem>();

export const useSourcesTableColumns = (
  saveName: (params: { name: string; id: number }) => void,
  saveParser: (params: { parser: ExpensesParser | null; id: number }) => void
) =>
  useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Имя",
        enableEditing: true,
        muiEditTextFieldProps: ({ row }) => ({
          onBlur: (event) => {
            const { value } = event.target;
            saveName({ name: value, id: row.original.id });
          },
        }),
      }),
      columnHelper.accessor("parser", {
        header: "Парсер",
        Header: <ParserHeader />,
        Cell: ({ cell }) =>
          parsersOptions.find((o) => o.value === cell.getValue())?.label,
        enableEditing: true,
        editVariant: "select",
        editSelectOptions: parsersOptions,
        muiEditTextFieldProps: ({ row }) => ({
          onBlur: (event) => {
            const value = event.target.value as ExpensesParser | null;
            saveParser({ parser: value, id: row.original.id });
          },
        }),
      }),
    ],
    [saveName, saveParser]
  );
