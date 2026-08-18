import { StatCards } from "@/components/dashboard/stat-cards";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { PipelineChart } from "@/components/dashboard/pipeline-chart";
import { QuickActions } from "@/components/dashboard/quick-actions";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Welcome back, Admin</h1>
        <p className="text-sm text-muted-foreground mt-1">System overview and quick actions</p>
      </div>

      <StatCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentActivity />
        <PipelineChart />
      </div>

      <QuickActions />

      
    </div>
  );
}
