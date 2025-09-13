import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-16 border-r border-border flex flex-col items-center py-4 space-y-6">
        <Skeleton className="h-6 w-6 rounded-md" />
        <Skeleton className="h-6 w-6 rounded-md" />
        <Skeleton className="h-6 w-6 rounded-md" />
        <div className="flex-grow" />
        <Skeleton className="h-6 w-6 rounded-md mt-auto" />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center">
        <Skeleton className="h-8 w-8 rounded-full" />
      </main>
    </div>
  );
}
