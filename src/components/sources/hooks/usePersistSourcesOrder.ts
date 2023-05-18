import { type GridApi } from "ag-grid-community";
import { debounce } from "lodash";
import { runInAction } from "mobx";
import { useMemo } from "react";
import { type SourceTableItem } from "~/models/Source";
import { dataStores } from "~/stores/dataStores";

function getSourcesOrder(api: GridApi<SourceTableItem>): number[] {
  const order: number[] = [];
  api.forEachNodeAfterFilterAndSort((node) => {
    if (node.data?.id !== undefined) {
      order.push(node.data?.id);
    }
  });
  return order;
}

export const usePersistSourcesOrder = () => {
  const persistFn = (api: GridApi<SourceTableItem>) => {
    runInAction(() => {
      const order = getSourcesOrder(api);
      void dataStores.userSettingsStore.persistSourcesOrder(order);
    });
  };
  const debouncedPersist = useMemo(() => debounce(persistFn, 500), []);

  return debouncedPersist;
};
