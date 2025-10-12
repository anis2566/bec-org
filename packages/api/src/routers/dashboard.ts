import type { TRPCRouterRecord } from "@trpc/server";
import z from "zod";
import { endOfMonth, startOfMonth, getMonth, startOfDay, endOfDay } from "date-fns";

import { adminProcedure } from "../trpc";
import {
  MONTH,
  SALARY_PAYMENT_STATUS,
  SALARY_STATUS,
  STUDENT_STATUS,
  TEACHER_STATUS,
} from "@workspace/utils/constant";

export const dashboardRouter = {
  admin: adminProcedure.query(async ({ ctx }) => {
    const currentYear = new Date().getFullYear().toString();
    const monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(new Date());

    const [
      totalStudent,
      presentStudent,
      absentStudent,
      totalTeacher,
      studentsByClass,
      thisMonthAdmissions,
      thisMonthLeavings,
      thisMonthPaidSalaries,
      thisMonthUnpaidSalaries,
      allClasses,
    ] = await Promise.all([
      ctx.db.student.count({
        where: {
          session: currentYear,
        },
      }),
      ctx.db.student.count({
        where: {
          session: currentYear,
          studentStatus: {
            status: STUDENT_STATUS.Present,
          },
        },
      }),
      ctx.db.student.count({
        where: {
          session: currentYear,
          studentStatus: {
            status: STUDENT_STATUS.Absent,
          },
        },
      }),
      ctx.db.teacher.count({
        where: {
          teacherStatus: {
            status: TEACHER_STATUS.Present,
          },
        },
      }),
      ctx.db.student.groupBy({
        by: ["classNameId"],
        where: {
          session: currentYear,
        },
        _count: {
          id: true,
        },
      }),
      ctx.db.student.groupBy({
        by: ["createdAt"],
        where: {
          session: currentYear,
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        _count: {
          createdAt: true,
        },
      }),
      ctx.db.student.groupBy({
        by: ["createdAt"],
        where: {
          session: currentYear,
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
          studentStatus: {
            status: STUDENT_STATUS.Absent,
          },
        },
        _count: {
          createdAt: true,
        },
      }),
      ctx.db.salaryPayment.groupBy({
        by: ["className"],
        where: {
          session: currentYear,
          month: Object.values(MONTH)[new Date().getMonth()],
          paymentStatus: SALARY_PAYMENT_STATUS.Paid,
        },
        _sum: {
          amount: true,
        },
      }),
      ctx.db.salaryPayment.groupBy({
        by: ["className"],
        where: {
          session: currentYear,
          month: Object.values(MONTH)[new Date().getMonth()],
          paymentStatus: SALARY_PAYMENT_STATUS.Unpaid,
        },
        _sum: {
          amount: true,
        },
      }),
      ctx.db.className.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          position: "asc",
        },
      }),
    ]);

    // Get class details for students by class
    const classDetails = allClasses.filter((cls) =>
      studentsByClass.some((item) => item.classNameId === cls.id)
    );

    const studentsByClassWithNames = studentsByClass.map((item) => {
      const classInfo = classDetails.find((c) => c.id === item.classNameId);
      return {
        classNameId: item.classNameId,
        className: classInfo?.name,
        studentCount: item._count.id,
      };
    });

    const formattedMonthAdmissions = thisMonthAdmissions.map((admission) => ({
      day: new Date(admission.createdAt).getDate(),
      count: admission._count.createdAt,
    }));

    const formattedMonthLeavings = thisMonthLeavings.map((leave) => ({
      day: new Date(leave.createdAt).getDate(),
      count: leave._count.createdAt,
    }));

    const daysInMonth = Array.from(
      { length: endOfMonth(new Date()).getDate() },
      (_, i) => i + 1
    );

    const MonthAdmissionsLeavingsChart = daysInMonth.map((day) => ({
      day: day,
      admissions:
        formattedMonthAdmissions.find((admission) => admission.day === day)
          ?.count || 0,
      leavings:
        formattedMonthLeavings.find((leave) => leave.day === day)?.count || 0,
    }));

    const formattedSalaries = allClasses.map((cls) => ({
      className: cls.name,
      paid:
        thisMonthPaidSalaries.find((salary) => salary.className === cls.name)
          ?._sum.amount || 0,
      unpaid:
        thisMonthUnpaidSalaries.find((salary) => salary.className === cls.name)
          ?._sum.amount || 0,
    }));

    return {
      totalStudent,
      presentStudent,
      absentStudent,
      totalTeacher,
      studentsByClass: studentsByClassWithNames,
      thisMonthAdmissionsLeavings: MonthAdmissionsLeavingsChart,
      salariesByClass: formattedSalaries,
    };
  }),
} satisfies TRPCRouterRecord;
