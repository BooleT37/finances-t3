import { UserSettingUpdateInputSchema } from "prisma/generated/zod";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userSettingsRouter = createTRPCRouter({
  get: protectedProcedure.query(({ ctx }) => ctx.db.userSetting.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
    })),
  // TODO any way to make it protected and call after login?
  createIfNotExist: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(({ ctx, input: { userId } }) => ctx.db.userSetting.upsert({
        create: {
          userId,
        },
        update: {},
        where: {
          userId,
        },
      })),
  update: protectedProcedure
    .input(UserSettingUpdateInputSchema)
    .mutation(({ ctx, input }) => ctx.db.userSetting.update({
        data: input,
        where: {
          userId: ctx.session.user.id,
        },
      })),
});
