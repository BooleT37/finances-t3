import {
  CategoryCreateWithoutUserInputObjectSchema,
  CategoryUpdateWithoutUserInputObjectSchema,
} from "prisma/generated/schemas";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { connectUser, filterByUser } from "~/server/api/utils/linkCurrentUser";

export const categoriesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.category.findMany({
      include: { subcategories: true },
      ...filterByUser(ctx),
    });
  }),
  create: protectedProcedure
    .input(CategoryCreateWithoutUserInputObjectSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.category.create({
        data: {
          ...input,
          ...connectUser(ctx),
        },
        include: { subcategories: true },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: CategoryUpdateWithoutUserInputObjectSchema,
      })
    )
    .mutation(({ ctx, input: { data, id } }) => {
      return ctx.prisma.category.update({
        data,
        where: { id },
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(({ ctx, input: { id } }) =>
      ctx.prisma.category.delete({
        where: {
          id,
        },
      })
    ),
});
