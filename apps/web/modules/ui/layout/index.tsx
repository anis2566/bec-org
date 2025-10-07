import { Suspense } from "react"

import {
    SidebarInset,
    SidebarProvider,
} from "@workspace/ui/components/sidebar"

import { AppSidebar } from "./app-sidebar"

interface Props {
    children: React.ReactNode
}

export const DashboardLayout = ({ children }: Props) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </Suspense>
    )
}