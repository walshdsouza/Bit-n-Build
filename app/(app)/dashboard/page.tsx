import IngestionCard from "@/components/dashboard/IngestionCard";
import ProcessingQueue from "@/components/dashboard/ProcessingQueue";
import UsageChart from "@/components/dashboard/UsageChart";
import EngineStatus from "@/components/dashboard/EngineStatus";
import RecentTranslations from "@/components/dashboard/RecentTranslations";

export default function DashboardPage() {
  return (
    <div className="p-space-lg max-w-[1200px] mx-auto">
      {/* Page header */}
      <div className="mb-space-lg">
        <p className="font-label-eyebrow text-label-eyebrow text-on-surface-variant uppercase tracking-widest mb-1">
          GestureSync AI
        </p>
        <h1 className="font-headline-md text-headline-md text-on-surface">Dashboard</h1>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
        {/* Left column — main ingestion card (spans 2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-space-md">
          <IngestionCard />
          <ProcessingQueue />
          <RecentTranslations />
        </div>

        {/* Right column — metrics */}
        <div className="flex flex-col gap-space-md">
          <UsageChart />
          <EngineStatus />
        </div>
      </div>
    </div>
  );
}
