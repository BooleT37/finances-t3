import { useEffect, useState } from "react";
import { type DataLoader } from "~/stores/DataLoader";

export function useDataStores(...stores: DataLoader<unknown>[]) {
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const datum = await Promise.all(
        stores.map(async (store) => {
          if (store.dataLoaded) {
            return;
          }
          const data = await store.loadData();
          store.setDataLoaded(true);
          return data;
        })
      );
      stores.map((store, index) => {
        if (datum[index]) {
          store.init(datum[index]);
        }
      });
      setDataLoaded(stores.every((store) => store.dataLoaded));
    })();
  }, [stores]);
  return { dataLoaded };
}
