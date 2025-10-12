import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";

import { AdminDashboardView } from "../components/admin-dashboard-view";

export const DashboardView = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="admin" className="w-full">
        <TabsList className="w-full rounded-xs mb-2 bg-muted">
          <TabsTrigger value="admin">Admin</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        <TabsContent value="admin">
          <AdminDashboardView />
        </TabsContent>
      </Tabs>
    </div>
  );
};
