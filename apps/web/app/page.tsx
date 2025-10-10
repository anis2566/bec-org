import { prefetch, trpc } from "@/trpc/server";

import { ContentLayout } from "@/modules/ui/layout/content-layout";
import { DashboardView } from "@/modules/ui/views/dashboard-view";

const Dashboard = async () => {
  prefetch(trpc.dashboard.admin.queryOptions());
  return (
    <ContentLayout>
      <DashboardView />
    </ContentLayout>
  );
};

export default Dashboard;
