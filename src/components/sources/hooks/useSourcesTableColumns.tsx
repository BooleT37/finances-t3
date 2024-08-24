import { createMRTColumnHelper } from "material-react-table";
import { useMemo } from "react";
import type { SourceTableItem } from "~/models/Source";

const columnHelper = createMRTColumnHelper<SourceTableItem>();

export const useSourcesTableColumns = (
  saveName: (name: string, id: number) => Promise<void>
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
    ],
    [saveName]
  );
