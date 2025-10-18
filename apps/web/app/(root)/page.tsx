import { ContentLayout } from "@/modules/ui/layout/content-layout";
import { DashboardView } from "@/modules/ui/views/dashboard-view";
import { prisma } from "@workspace/db";

const Dashboard = async () => {
  // await prisma.permission.deleteMany();
  // await prisma.role.updateMany({
  //   data: {
  //     permissionIds: {
  //       set: [],
  //     },
  //   }
  // })
  return (
    <ContentLayout>
      Dashboard
      {/* <DashboardView /> */}
    </ContentLayout>
  );
};

export default Dashboard;
