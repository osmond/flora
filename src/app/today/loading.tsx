// src/app/today/loading.tsx
export default function LoadingToday() {
  return (
    <div className="p-6">
      <div className="h-6 w-40 rounded bg-muted animate-pulse mb-4" />
      <div className="space-y-3">
        <div className="h-20 rounded-xl border bg-card animate-pulse" />
        <div className="h-20 rounded-xl border bg-card animate-pulse" />
        <div className="h-20 rounded-xl border bg-card animate-pulse" />
      </div>
    </div>
  );
}
