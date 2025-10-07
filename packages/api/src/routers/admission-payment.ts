import type { TRPCRouterRecord } from "@trpc/server";
import z from "zod";

import { adminProcedure } from "../trpc";
import { ADMISSION_PAYMENT_STATUS } from "@workspace/utils/constant";

export const admissionPaymentRouter = {
  changeStatus: adminProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.string(),
        paymentStatus: z.string(),
        method: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, status, paymentStatus, method } = input;

      try {
        const payment = await ctx.db.admissionPayment.findUnique({
          where: {
            id,
          },
        });

        if (!payment) {
          return { success: false, message: "Payment not found" };
        }

        await ctx.db.admissionPayment.update({
          where: {
            id,
          },
          data: {
            method,
            status,
            paymentStatus,
            paidAt: new Date(),
          },
        });

        return { success: true, message: "Payment updated" };
      } catch (error) {
        console.error("Error updating payment", error);
        return { success: false, message: "Internal Server Error" };
      }
    }),
  getOne: adminProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const paymentId = input;

    const paymentData = await ctx.db.admissionPayment.findUnique({
      where: { id: paymentId, status: "Active", paymentStatus: "Unpaid" },
      include: {
        student: {
          select: {
            studentId: true,
            name: true,
            imageUrl: true,
            className: true,
          },
        },
      },
    });

    console.log(paymentData);

    if (!paymentData) {
      return { success: false, message: "Payment not found" };
    }

    return { success: true, data: paymentData };
  }),
  getDueMany: adminProcedure
    .input(
      z.object({
        page: z.number(),
        limit: z.number().min(1).max(100),
        sort: z.string().nullish(),
        search: z.string().nullish(),
        session: z.string().nullish(),
        className: z.string().nullish(),
        id: z.string().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { page, limit, sort, search, session, className, id } = input;

      const [payments, totalCount] = await Promise.all([
        ctx.db.admissionPayment.findMany({
          where: {
            paymentStatus: ADMISSION_PAYMENT_STATUS.Unpaid,
            ...(search && {
              student: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              ...(session && {
                session,
              }),
              ...(className && {
                className,
              }),
              ...(id && {
                student: {
                  studentId: parseInt(id),
                },
              }),
            }),
          },
          include: {
            student: {
              select: {
                name: true,
                imageUrl: true,
                studentId: true,
                className: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: sort === "asc" ? "asc" : "desc",
          },
          take: limit,
          skip: (page - 1) * limit,
        }),
        ctx.db.admissionPayment.count({
          where: {
            paymentStatus: ADMISSION_PAYMENT_STATUS.Unpaid,
            ...(search && {
              student: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              ...(session && {
                session,
              }),
              ...(className && {
                className,
              }),
              ...(id && {
                student: {
                  studentId: parseInt(id),
                },
              }),
            }),
          },
        }),
      ]);

      return {
        payments,
        totalCount,
      };
    }),
  getMany: adminProcedure
    .input(
      z.object({
        page: z.number(),
        limit: z.number().min(1).max(100),
        sort: z.string().nullish(),
        search: z.string().nullish(),
        session: z.string().nullish(),
        className: z.string().nullish(),
        id: z.string().nullish(),
        paymentStatus: z.string().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const {
        page,
        limit,
        sort,
        search,
        session,
        className,
        id,
        paymentStatus,
      } = input;

      const [payments, totalCount] = await Promise.all([
        ctx.db.admissionPayment.findMany({
          where: {
            ...(search && {
              student: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              ...(session && {
                session,
              }),
              ...(className && {
                className,
              }),
              ...(id && {
                student: {
                  studentId: parseInt(id),
                },
              }),
              ...(paymentStatus && {
                paymentStatus,
              }),
            }),
          },
          include: {
            student: {
              select: {
                name: true,
                imageUrl: true,
                studentId: true,
                className: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: sort === "asc" ? "asc" : "desc",
          },
          take: limit,
          skip: (page - 1) * limit,
        }),
        ctx.db.admissionPayment.count({
          where: {
            ...(search && {
              student: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              ...(session && {
                session,
              }),
              ...(className && {
                className,
              }),
              ...(id && {
                student: {
                  studentId: parseInt(id),
                },
              }),
              ...(paymentStatus && {
                paymentStatus,
              }),
            }),
          },
        }),
      ]);

      return {
        payments,
        totalCount,
      };
    }),
} satisfies TRPCRouterRecord;
