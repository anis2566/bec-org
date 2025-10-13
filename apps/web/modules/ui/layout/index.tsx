"use client";

import { Suspense } from "react";

import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";

import { AppSidebar } from "./app-sidebar";
import { usePathname } from "next/navigation";
import Loader from "@/components/loader";

interface Props {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: Props) => {
  const pathname = usePathname();
  const isAuthRoute = pathname === "/sign-in" || pathname === "/sign-up";

  return (
    <Suspense fallback={<Loader />}>
      {isAuthRoute ? (
        <>{children}</>
      ) : (
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      )}
    </Suspense>
  );
};
