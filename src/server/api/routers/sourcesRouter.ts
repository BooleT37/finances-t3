import {
  SourceCreateWithoutUserInputObjectSchema,
  SourceUpdateWithoutUserInputObjectSchema,
} from "prisma/generated/schemas";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { connectUser, filterByUser } from "~/server/api/utils/linkCurrentUser";

export const sourcesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.source.findMany(filterByUser(ctx));
  }),
  create: protectedProcedure
    .input(SourceCreateWithoutUserInputObjectSchema)
    .mutation(({ ctx, input }) =>
      ctx.db.source.create({
        data: {
          ...input,
          ...connectUser(ctx),
        },
      })
    ),
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: SourceUpdateWithoutUserInputObjectSchema,
      })
    )
    .mutation(({ ctx, input: { data, id } }) =>
      ctx.db.source.update({
        data,
        where: { id },
      })
    ),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input: { id } }) =>
      ctx.db.source.delete({
        where: { id },
      })
    ),
});
