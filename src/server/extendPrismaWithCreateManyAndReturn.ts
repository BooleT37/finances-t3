/* eslint-disable */
import { Prisma, type PrismaClient } from "@prisma/client";

export function extendPrismaWithCreateManyAndReturn(client: PrismaClient) {
  return client.$extends({
    name: "createManyAndReturn",
    model: {
      $allModels: {
        async createManyAndReturn<T, A>(
          this: T,
          args: Prisma.Exact<A, Prisma.Args<T, "createMany">>
        ): Promise<Prisma.Result<T, A, "createMany"> & { ids: bigint[] }> {
          const thisAny = this as any;
          const argsAny = args as any;
          const ctx = Prisma.getExtensionContext(this);

          const providedIds: bigint[] = [];

          argsAny.data.forEach((record: any) => {
            if (record.id) {
              providedIds.push(record.id);
            }
          });

          const numberOfRecordsWithoutId =
            argsAny.data.length - providedIds.length;

          const ids = await client.$queryRaw<
            {
              nextval: bigint;
            }[]
          >`
                SELECT nextval(pg_get_serial_sequence('public."${
                  ctx.name ? Prisma.raw(ctx.name) : ctx.name
                }"','id')) FROM generate_series(1, ${numberOfRecordsWithoutId}) n
              `;

          let freeIdIndex = 0;
          const newRecords = argsAny.data.map((record: any) => {
            return {
              ...record,
              id: record.id ? record.id : Number(ids[freeIdIndex++]?.nextval),
            };
          });

          const result = await thisAny.createMany({
            ...argsAny,
            data: newRecords,
          });

          return {
            ...result,
            ids: [...providedIds, ...ids.map((id) => id.nextval)],
          };
        },
      },
    },
  });
}
