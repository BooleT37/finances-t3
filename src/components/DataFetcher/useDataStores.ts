import { useEffect, useState } from "react";
import type { DataLoader } from "~/stores/DataLoader";
import type { Stores } from "./types";

export function useDataStores(stores: Stores) {
  const [dataLoaded, setDataLoaded] = useState(false);

  const storesList = Object.values(stores).filter(
    (store): store is DataLoader => !!store
  );

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const datum = await Promise.all(
        storesList.map(async (store) => {
          if (store.dataLoaded) {
            return;
          }
          const data = await store.loadData();
          store.setDataLoaded(true);
          return data;
        })
      );
      storesList.map((store, index) => {
        if (datum[index]) {
          store.init(datum[index]);
        }
      });
      setDataLoaded(storesList.every((store) => store.dataLoaded));
    })();
  }, [storesList]);
  return { dataLoaded };
}
