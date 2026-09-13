/** Fields used by the dashboard's persisted project summaries. */
export interface DashboardProject {
  id: string;
  title: string;
  status: string;
  created_at?: string | null;
  source_duration?: number | null;
}
