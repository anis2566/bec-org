import type { TRPCRouterRecord } from "@trpc/server";
import z from "zod";

import { protectedProcedure } from "../trpc";

export const userRouter = {
  forSelect: protectedProcedure
    .input(
      z.object({
        search: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { search } = input;

      const users = await ctx.db.user.findMany({
        where: {
          ...(search && {
            name: {
              contains: search,
              mode: "insensitive",
            },
          }),
        },
      });

      return users;
    }),
} satisfies TRPCRouterRecord;
