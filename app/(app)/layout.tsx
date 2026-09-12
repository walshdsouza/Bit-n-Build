import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 ml-16">
        <TopBar />
        <main className="flex-1 overflow-auto bg-surface-container-lowest/40">
          {children}
        </main>
      </div>
    </div>
  );
}
