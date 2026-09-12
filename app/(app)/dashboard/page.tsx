import IngestionCard from "@/components/dashboard/IngestionCard";
import ProcessingQueue from "@/components/dashboard/ProcessingQueue";
import UsageChart from "@/components/dashboard/UsageChart";
import EngineStatus from "@/components/dashboard/EngineStatus";
import RecentTranslations from "@/components/dashboard/RecentTranslations";

import { createClient } from '@/utils/supabase/server';
import { isSupabaseConfigured } from '@/utils/supabase/config';

export default async function DashboardPage() {
  let activeJobs: any[] = [];
  let recentJobs: any[] = [];

  // Guarded: without NEXT_PUBLIC_SUPABASE_* the client factory throws, which
  // during prerendering fails the production build outright. Translation does
  // not need a database, so the dashboard renders empty instead.
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (data) {
          activeJobs = data.filter(p => p.status === 'processing');
          recentJobs = data.filter(p => p.status === 'ready');
        }
      }
    } catch (e) {
      console.warn('[dashboard] Supabase unavailable, showing empty state:', e);
    }
  }

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
          <ProcessingQueue jobs={activeJobs} />
          <RecentTranslations translations={recentJobs} />
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
