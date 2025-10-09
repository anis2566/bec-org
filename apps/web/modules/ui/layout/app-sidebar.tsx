"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Calendar,
  Combine,
  Command,
  DollarSign,
  Frame,
  GalleryVerticalEnd,
  House,
  List,
  LogIn,
  Map,
  NotebookPen,
  PieChart,
  PlusCircle,
  School,
  Send,
  Settings,
  Settings2,
  Shapes,
  ShieldEllipsis,
  SquareTerminal,
  UserPlus,
  Users,
  UserX,
  Wallpaper,
  Warehouse,
  History,
  MessageSquareMore,
  BookMarked,
  BringToFront,
  UsersRound,
  Layers3,
  HandCoins,
  Package,
  CalendarDays,
  TrendingUp,
  Coins,
  UserRoundPen,
  Wallet,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@workspace/ui/components/sidebar";

import { Header } from "./header";
import { NavAcademic } from "./nav-academic";
import { NavUtils } from "./nav-utils";
import { NavFees } from "./nav-fees";
import { NavStudent } from "./nav-student";
import { NavAttendance } from "./nav-attendance";
import { NavResult } from "./nav-result";
import { NavIncome } from "./nav-income";
import { NavExpense } from "./nav-expense";
import { NavRolePermission } from "./nav-role-permission";
import { NavSms } from "./nav-sms";
import { NavHomework } from "./nav-homework";
import { NavFee } from "./nav-fee";
import { NavTeacher } from "./nav-teacher";
import { NavRoomHouse } from "./nav-room-house";
import { NavBatch } from "./nav-batch";
import { NavReport } from "./nav-report";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  academic: [
    {
      title: "Class",
      url: "/class",
      icon: Shapes,
      items: [],
    },
    {
      title: "Institute",
      url: "/institute",
      icon: School,
      items: [],
    },
    {
      title: "Subject",
      url: "/subject",
      icon: BookOpen,
      items: [],
    },
  ],
  student: [
    {
      title: "Admission",
      url: "/admission",
      icon: UserPlus,
      items: [],
    },
    {
      title: "Student",
      url: "",
      icon: Users,
      items: [
        {
          title: "List",
          url: "/student",
          icon: List,
        },
        {
          title: "Absent",
          url: "/student/absent",
          icon: UserX,
        },
      ],
    },
  ],
  attendance: [
    {
      title: "Student",
      url: "",
      icon: Users,
      items: [
        {
          title: "Create",
          url: "/attendance/student/new",
          icon: PlusCircle,
        },
        {
          title: "List",
          url: "/attendance/student",
          icon: List,
        },
      ],
    },
  ],
  batch: [
    {
      title: "Batch",
      url: "",
      icon: Layers3,
      items: [
        {
          title: "New",
          url: "/batch/new",
          icon: PlusCircle,
        },
        {
          title: "List",
          url: "/batch",
          icon: List,
        },
      ],
    },
    {
      title: "Room Plan",
      url: "/room-plan",
      icon: Warehouse,
      items: [],
    },
  ],
  fee: [
    {
      title: "Salary",
      url: "",
      icon: Calendar,
      items: [
        {
          title: "Receive Fee",
          url: "/fee/salary/new",
          icon: PlusCircle,
        },
        {
          title: "History",
          url: "/fee/salary",
          icon: History,
        },
        {
          title: "Due",
          url: "/fee/salary/due",
          icon: List,
        },
        {
          title: "Overview",
          url: "/fee/salary/overview",
          icon: BringToFront,
        },
      ],
    },
    {
      title: "Admission",
      url: "",
      icon: LogIn,
      items: [
        {
          title: "Due",
          url: "/fee/admission/due",
          icon: List,
        },
        {
          title: "History",
          url: "/fee/admission",
          icon: History,
        },
      ],
    },
  ],
  homework: [
    {
      title: "Homework",
      url: "",
      icon: BookMarked,
      items: [
        {
          title: "New",
          url: "/homework/new",
          icon: PlusCircle,
        },
        {
          title: "List",
          url: "/homework/exam",
          icon: List,
        },
      ],
    },
  ],
  teacher: [
    {
      title: "Teacher",
      url: "",
      icon: UsersRound,
      items: [
        {
          title: "New",
          url: "/teacher/new",
          icon: PlusCircle,
        },
        {
          title: "List",
          url: "/teacher",
          icon: List,
        },
      ],
    },
  ],
  result: [
    {
      title: "Category",
      url: "/exam/category",
      icon: Layers3,
      items: [],
    },
    {
      title: "Exam",
      url: "",
      icon: NotebookPen,
      items: [
        {
          title: "New",
          url: "/exam/new",
          icon: PlusCircle,
        },
        {
          title: "List",
          url: "/exam",
          icon: List,
        },
      ],
    },
    {
      title: "Combine",
      url: "",
      icon: Combine,
      items: [
        {
          title: "New",
          url: "/exam/combine/new",
          icon: PlusCircle,
        },
        {
          title: "List",
          url: "/exam/combine",
          icon: List,
        },
      ],
    },
  ],
  income: [
    {
      title: "Income",
      url: "",
      icon: DollarSign,
      items: [
        {
          title: "New",
          url: "/income/other/new",
          icon: PlusCircle,
        },
        {
          title: "List",
          url: "/income/other",
          icon: List,
        },
      ],
    },
  ],
  expense: [
    {
      title: "Advance",
      url: "",
      icon: HandCoins,
      items: [
        {
          title: "New",
          url: "/expense/advance/new",
          icon: PlusCircle,
        },
        {
          title: "List",
          url: "/expense/advance",
          icon: List,
        },
      ],
    },
    {
      title: "Teacher Bill",
      url: "",
      icon: UsersRound,
      items: [
        {
          title: "New",
          url: "/expense/teacher/new",
          icon: PlusCircle,
        },
        {
          title: "List",
          url: "/expense/teacher",
          icon: List,
        },
      ],
    },
    {
      title: "House Rent",
      url: "",
      icon: House,
      items: [
        {
          title: "New",
          url: "/expense/house/new",
          icon: PlusCircle,
        },
        {
          title: "List",
          url: "/expense/house",
          icon: List,
        },
      ],
    },
    {
      title: "Utility Bill",
      url: "",
      icon: Package,
      items: [
        {
          title: "New",
          url: "/expense/utility/new",
          icon: PlusCircle,
        },
        {
          title: "List",
          url: "/expense/utility",
          icon: List,
        },
      ],
    },
  ],
  sms: [
    {
      title: "SMS",
      url: "",
      icon: MessageSquareMore,
      items: [
        {
          title: "Bulk SMS",
          url: "/sms/new",
          icon: Send,
          items: [],
        },
        {
          title: "Due List SMS",
          url: "/sms/due",
          icon: Send,
          items: [],
        },
        {
          title: "History",
          url: "/sms",
          icon: History,
          items: [],
        },
        {
          title: "Settings",
          url: "/sms/setting",
          icon: Settings,
          items: [],
        },
      ],
    },
  ],
  rolePermission: [
    {
      title: "Role & Permission",
      url: "",
      icon: Wallpaper,
      items: [],
    },
  ],
  report: [
    {
      title: "Daily",
      url: "/report/daily",
      icon: CalendarDays,
      items: [],
    },
    {
      title: "Income",
      url: "",
      icon: HandCoins,
      items: [
        {
          title: "Salary",
          url: "/report/income/salary",
          icon: DollarSign,
        },
        {
          title: "Admission",
          url: "/report/income/admission",
          icon: DollarSign,
        },
        {
          title: "Other",
          url: "/report/income/other",
          icon: DollarSign,
        },
        {
          title: "Overview",
          url: "/report/income",
          icon: TrendingUp,
        },
      ],
    },
    {
      title: "Expense",
      url: "",
      icon: Coins,
      items: [
        {
          title: "Teacher Bill",
          url: "/report/expense/teacher",
          icon: UserRoundPen,
        },
        {
          title: "House rent",
          url: "/report/expense/house",
          icon: House,
        },
        {
          title: "Utility",
          url: "/report/expense/utility",
          icon: Package,
        },
        {
          title: "Overview",
          url: "/report/expense",
          icon: TrendingUp,
        },
      ],
    },
    {
      title: "Final",
      url: "/report",
      icon: Wallet,
      items: [],
    },
  ],
  roomHouses: [
    {
      title: "House",
      url: "",
      icon: House,
      items: [
        {
          title: "New",
          url: "/house/new",
          icon: PlusCircle,
        },
        {
          title: "List",
          url: "/house",
          icon: List,
        },
      ],
    },
    {
      title: "Room",
      url: "",
      icon: Warehouse,
      items: [
        {
          title: "New",
          url: "/room/new",
          icon: PlusCircle,
        },
        {
          title: "List",
          url: "/room",
          icon: List,
        },
      ],
    },
  ],
  utils: [
    {
      title: "Counter",
      url: "/utils/counter",
      icon: ShieldEllipsis,
      items: [],
    },
  ],
  fees: [
    {
      title: "Admission",
      url: "/utils/fee/admission",
      icon: LogIn,
      items: [],
    },
    {
      title: "Salary",
      url: "/utils/fee/salary",
      icon: Calendar,
      items: [],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-[#1D1E4E]">
        <Header />
      </SidebarHeader>
      <SidebarContent className="bg-[#1D1E4E]">
        <NavAcademic items={data.academic} />
        <NavStudent items={data.student} />
        <NavAttendance items={data.attendance} />
        <NavBatch items={data.batch} />
        <NavFee items={data.fee} />
        <NavHomework items={data.homework} />
        <NavTeacher items={data.teacher} />
        <NavResult items={data.result} />
        <NavIncome items={data.income} />
        <NavReport items={data.report} />
        <NavExpense items={data.expense} />
        <NavRoomHouse items={data.roomHouses} />
        <NavFees items={data.fees} />
        <NavUtils items={data.utils} />
        <NavSms items={data.sms} />
        <NavRolePermission items={data.rolePermission} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
