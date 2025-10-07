import type { TRPCRouterRecord } from "@trpc/server";
import z from "zod";

import { adminProcedure } from "../trpc";

import { FindStudentSchema, StudentSchema } from "@workspace/utils/schemas";
import {
  ADMISSION_PAYMENT_STATUS,
  ADMISSION_STATUS,
  MONTH,
  SALARY_PAYMENT_STATUS,
  SALARY_STATUS,
  STUDENT_STATUS,
} from "@workspace/utils/constant";

export const studentRouter = {
  createOne: adminProcedure
    .input(StudentSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const existingStudent = await ctx.db.student.findFirst({
          where: {
            classNameId: input.classNameId,
            studentId: parseInt(input.studentId),
          },
        });

        if (existingStudent) {
          return {
            success: false,
            message: "Student with this ID already exists",
          };
        }

        const months = Object.values(MONTH);
        const currentMonthIndex = new Date().getMonth();
        const currentMonth = Object.values(MONTH)[currentMonthIndex] as string;

        await ctx.db.$transaction(async (tx) => {
          const newStudent = await tx.student.create({
            data: {
              ...input,
              session: new Date().getFullYear().toString(),
              studentId: parseInt(input.studentId),
              dob: new Date(input.dob),
              roll: parseInt(input.roll),
              admissionFee: parseInt(input.admissionFee),
              salaryFee: parseInt(input.salaryFee),
              courseFee: null,
              studentStatus: {
                create: {
                  status: STUDENT_STATUS.Present,
                },
              },
            },
            select: {
              id: true,
              className: {
                select: {
                  name: true,
                },
              },
            },
          });

          await tx.admissionPayment.create({
            data: {
              className: newStudent.className.name,
              amount: parseInt(input.admissionFee),
              method: "N/A",
              session: new Date().getFullYear().toString(),
              month: currentMonth,
              studentId: newStudent.id,
              status: ADMISSION_STATUS.Present,
              paymentStatus: ADMISSION_PAYMENT_STATUS.Unpaid,
            },
          });

          for (let i = 0; i < months.length; i++) {
            let status: string;
            let paymentStatus: string | undefined;

            if (i < currentMonthIndex) {
              status = "N/A";
              paymentStatus = "N/A";
            } else if (i === currentMonthIndex) {
              status = SALARY_STATUS.Present;
              paymentStatus = SALARY_PAYMENT_STATUS.Unpaid;
            } else {
              status = SALARY_STATUS.Initiated;
              paymentStatus = SALARY_PAYMENT_STATUS["N/A"];
            }

            await tx.salaryPayment.create({
              data: {
                session: new Date().getFullYear().toString(),
                month: months[i] as string,
                studentId: newStudent.id,
                className: newStudent.className.name,
                method: "N/A",
                status: status,
                ...(paymentStatus && { paymentStatus }),
                amount: parseInt(input.salaryFee),
              },
            });
          }

          await tx.counter.update({
            where: {
              type: newStudent.className.name,
            },
            data: {
              value: {
                increment: 1,
              },
            },
          });
        });

        return { success: true, message: "Admission successfull" };
      } catch (error) {
        console.error("Error creating admission", error);
        return { success: false, message: "Internal Server Error" };
      }
    }),
  forPaymentSelect: adminProcedure
    .input(FindStudentSchema)
    .mutation(async ({ input, ctx }) => {
      const { classNameId, search } = input;

      const isNumberSearch = !isNaN(parseInt(search));
      const isPhoneSearch = search.length === 11 && isNumberSearch;

      try {
        const student = await ctx.db.student.findFirst({
          where: {
            classNameId: classNameId,
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              ...(isPhoneSearch
                ? [
                    {
                      mPhone: {
                        contains: search,
                      },
                    },
                    {
                      fPhone: {
                        contains: search,
                      },
                    },
                  ]
                : []),
              ...(isNumberSearch && !isPhoneSearch
                ? [
                    {
                      studentId: parseInt(search),
                    },
                  ]
                : []),
            ],
          },
          select: {
            name: true,
            studentId: true,
            imageUrl: true,
            salaryFee: true,
            className: {
              select: {
                name: true,
              },
            },
            salaryPayments: {
              where: {
                paymentStatus: SALARY_PAYMENT_STATUS.Unpaid,
              },
              select: {
                month: true,
                amount: true,
                status: true,
                paymentStatus: true,
                id: true,
              },
            },
          },
        });

        if (!student) {
          return {
            success: false,
            message: "Student not found",
            student: null,
          };
        }

        return {
          success: true,
          student,
          data: student,
          message: "Student found",
        };
      } catch (error) {
        console.error(`Error getting student for payment select: ${error}`);
        return {
          success: false,
          message: "Internal Server Error",
          student: null,
        };
      }
    }),
  getByBatch: adminProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const batchId = input;

    const students = await ctx.db.student.findMany({
      where: {
        batchId,
      },
      select: {
        id: true,
        name: true,
        studentId: true,
        imageUrl: true,
        mPhone: true,
      },
    });

    return students;
  }),
  getOne: adminProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const studentId = input;

    const studentData = await ctx.db.student.findUnique({
      where: { id: studentId },
      include: {
        studentStatus: true,
      },
    });

    if (!studentData) {
      throw new Error("Student not found");
    }

    return studentData;
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
      })
    )
    .query(async ({ input, ctx }) => {
      const { page, limit, sort, search, session, className, id } = input;

      const [students, totalCount] = await Promise.all([
        ctx.db.student.findMany({
          where: {
            ...(search && {
              name: {
                contains: search,
                mode: "insensitive",
              },
            }),
            ...(session && {
              session,
            }),
            ...(className && {
              className: {
                name: className,
              },
            }),
            ...(id && {
              studentId: parseInt(id),
            }),
          },
          include: {
            className: true,
            studentStatus: true,
          },
          orderBy: {
            createdAt: sort === "asc" ? "asc" : "desc",
          },
          take: limit,
          skip: (page - 1) * limit,
        }),
        ctx.db.student.count({
          where: {
            ...(search && {
              name: {
                contains: search,
                mode: "insensitive",
              },
            }),
            ...(session && {
              session,
            }),
            ...(className && {
              className: {
                name: className,
              },
            }),
            ...(id && {
              studentId: parseInt(id),
            }),
          },
        }),
      ]);

      return {
        students,
        totalCount,
      };
    }),
} satisfies TRPCRouterRecord;
