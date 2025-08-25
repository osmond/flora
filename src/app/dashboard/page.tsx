export const dynamic = "force-dynamic"

async function fetchStats() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/dashboard`, { cache: "no-store" })
  if (!res.ok) return null
  return res.json()
}

export default async function DashboardPage() {
  const stats = await fetchStats()
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="Weekly Completion" value={stats?.completion != null ? `${stats.completion}%` : "—"} subtitle={`${stats?.totalDone ?? 0} actions`} />
          <Card title="Plants" value={stats?.plants ?? 0} subtitle="total" />
          <Card title="Expected / wk" value={stats?.totalExpected ?? 0} subtitle="naive" />
          <Card title="Done / wk" value={stats?.totalDone ?? 0} subtitle="events" />
        </section>

        <section className="rounded-2xl border bg-card text-card-foreground p-6">
          <h2 className="text-lg font-medium mb-4">Activity (7 days)</h2>
          <div className="grid grid-cols-7 gap-2">
            {(stats?.hist || []).map((d: any) => (
              <div key={d.day} className="flex flex-col items-center gap-2">
                <div className="w-8 rounded-md bg-primary/20" style={{ height: 4 + d.count * 8 }} />
                <div className="text-[10px] text-muted-foreground">{d.day.slice(5)}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

function Card({ title, value, subtitle }: { title: string; value: string | number; subtitle?: string }) {
  return (
    <div className="rounded-2xl border bg-card text-card-foreground p-5">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="text-3xl font-bold">{value}</div>
      {subtitle ? <div className="text-xs text-muted-foreground mt-1">{subtitle}</div> : null}
    </div>
  )
}

