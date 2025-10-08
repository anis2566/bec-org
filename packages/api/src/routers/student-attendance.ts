import type { TRPCRouterRecord } from "@trpc/server";
import z from "zod";

import { adminProcedure } from "../trpc";

import { AttendanceSchema, ClassNameSchema } from "@workspace/utils/schemas";

export const studentAttendanceRouter = {
  createMany: adminProcedure
    .input(
      z.object({
        attendances: z.array(AttendanceSchema).min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { attendances } = input;

      try {
        const existingAttendances = await ctx.db.attendence.findFirst({
          where: {
            
            batchId: attendances[0]?.batchId,
          },
        });


      } catch (error) {
        console.error("Error creating attendance", error);
        return { success: false, message: "Internal Server Error" };
      }
    }),
} satisfies TRPCRouterRecord;
