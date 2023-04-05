import { UserSettingUpdateInputObjectSchema } from "prisma/generated/schemas";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userSettingsRouter = createTRPCRouter({
  get: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.userSetting.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  // TODO any way to make it protected and call after login?
  createIfNotExist: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(({ ctx, input: { userId } }) => {
      return ctx.prisma.userSetting.upsert({
        create: {
          userId,
        },
        update: {},
        where: {
          userId,
        },
      });
    }),
  update: protectedProcedure
    .input(UserSettingUpdateInputObjectSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.userSetting.update({
        data: input,
        where: {
          userId: ctx.session.user.id,
        },
      });
    }),
});
