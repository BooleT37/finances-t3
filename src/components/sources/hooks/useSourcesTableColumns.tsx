import type { ExpensesParser } from "@prisma/client";
import { createMRTColumnHelper } from "material-react-table";
import { useMemo } from "react";
import type { SourceTableItem } from "~/models/Source";
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
  saveName: (name: string, id: number) => Promise<void>,
  saveParser: (parser: ExpensesParser | null, id: number) => Promise<void>
) =>
  useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Имя",
        enableEditing: true,
        muiEditTextFieldProps: ({ row }) => ({
          onBlur: (event) => {
            const { value } = event.target;
            void saveName(value, row.original.id);
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
            void saveParser(value, row.original.id);
          },
        }),
      }),
    ],
    [saveName, saveParser]
  );
