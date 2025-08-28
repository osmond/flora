import DashboardStat from "@/components/DashboardStat"
import BackupControls from "@/components/BackupControls"
import CarePlanActions from "@/components/admin/CarePlanActions"
import AreaOverview from "@/components/charts/AreaOverview"
import CarePlanList from "@/components/admin/CarePlanList"

export const dynamic = "force-dynamic"

async function fetchStats() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/dashboard`, { cache: "no-store" })
  if (!res.ok) return null
  return res.json()
}

async function fetchCarePlans() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/care-plans/list`, { cache: "no-store" })
  if (!res.ok) return [] as any[]
  const json = await res.json().catch(() => ({ plants: [] }))
  return (json?.plants ?? []) as any[]
}

async function fetchSchemaHealth() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/schema-health`, { cache: "no-store" })
  if (!res.ok) return null
  return res.json()
}

export default async function DashboardPage() {
  const [stats, plans, schema] = await Promise.all([fetchStats(), fetchCarePlans(), fetchSchemaHealth()])
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        <section className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Overview</h2>
          <CarePlanActions />
        </section>

        <section className="rounded-2xl border bg-card text-card-foreground p-6">
          <h2 className="text-lg font-medium mb-4">Care Plans</h2>
          {plans.length ? (
            <CarePlanList plans={plans as any[]} />
          ) : (
            <p className="text-sm text-muted-foreground">No care plans yet. Use Generate All above.</p>
          )}
        </section>

        <section className="rounded-2xl border bg-card text-card-foreground p-6">
          <h2 className="text-lg font-medium mb-4">Schema Health</h2>
          {schema ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground">
                  <tr>
                    <th className="py-2 pr-4">Field</th>
                    <th className="py-2 pr-4">Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="py-2 pr-4 font-medium">plants.id</td>
                    <td className="py-2 pr-4">{schema.types?.plants_id ?? '—'}</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-2 pr-4 font-medium">events.plant_id</td>
                    <td className="py-2 pr-4">{schema.types?.events_plant_id ?? '—'}</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-2 pr-4 font-medium">tasks.plant_id</td>
                    <td className="py-2 pr-4">{schema.types?.tasks_plant_id ?? '—'}</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-3 text-xs text-muted-foreground">
                FK coverage: events→plants {schema.fkCoverage?.events_to_plants_percent ?? '—'}%, tasks→plants {schema.fkCoverage?.tasks_to_plants_percent ?? '—'}%
              </div>
              {schema.types?.plants_id && schema.types?.events_plant_id && schema.types?.tasks_plant_id && schema.types.plants_id !== schema.types.events_plant_id || schema.types.plants_id !== schema.types.tasks_plant_id ? (
                <p className="mt-2 text-sm text-destructive">Warning: ID types differ across tables. Align events/tasks to match plants.id.</p>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Unable to fetch schema health.</p>
          )}
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardStat
            title="Weekly Completion"
            value={stats?.completion != null ? `${stats.completion}%` : "—"}
            subtitle={`${stats?.totalDone ?? 0} actions`}
          />
          <DashboardStat title="Current Streak" value={stats?.streak ?? 0} subtitle="days" />
          <DashboardStat title="Plants" value={stats?.plants ?? 0} subtitle="total" />
          <DashboardStat title="Done / wk" value={stats?.totalDone ?? 0} subtitle="events" />
        </section>
        <section className="rounded-2xl border bg-card text-card-foreground p-6">
          <h2 className="text-lg font-medium mb-4">Needs Attention</h2>
          {stats?.attention?.length ? (
            <ul className="space-y-3">
              {stats.attention.map((t: any) => (
                <li key={t.id} className="flex items-center justify-between">
                  <div className="font-medium">{t.plantName}</div>
                  <div className="text-sm text-muted-foreground">
                    {t.type === "water"
                      ? "Water"
                      : t.type === "fertilize"
                      ? "Fertilize"
                      : t.type}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">All plants are happy 🌿</p>
          )}
        </section>
        <section className="rounded-2xl border bg-card text-card-foreground p-6">
          <h2 className="text-lg font-medium mb-4">Neglected Plants</h2>
          {stats?.neglected?.length ? (
            <ul className="space-y-3">
              {stats.neglected.map((p: any) => (
                <li key={p.id} className="flex items-center justify-between">
                  <div className="font-medium">{p.plantName}</div>
                  <div className="text-sm text-muted-foreground">{p.days}d</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No neglected plants 🎉</p>
          )}
        </section>

        <section className="rounded-2xl border bg-card text-card-foreground p-6">
          <h2 className="text-lg font-medium mb-4">Longest Streaks</h2>
          {stats?.longestStreaks?.length ? (
            <ul className="space-y-3">
              {stats.longestStreaks.map((s: any) => (
                <li key={s.id} className="flex items-center justify-between">
                  <div className="font-medium">{s.plantName}</div>
                  <div className="text-sm text-muted-foreground">{s.streak}d</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No streaks yet</p>
          )}
        </section>

        <section className="rounded-2xl border bg-card text-card-foreground p-6">
          <h2 className="text-lg font-medium mb-4">Overdue Trend (7 days)</h2>
          <div className="grid grid-cols-7 gap-2">
            {(stats?.overdueTrend || []).map((d: any) => (
              <div key={d.day} className="flex flex-col items-center gap-2">
                <div className="w-8 rounded-md bg-destructive/20" style={{ height: 4 + d.count * 8 }} />
                <div className="text-[10px] text-muted-foreground">{d.day.slice(5)}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <AreaOverview
            title="Activity (7 days)"
            description="Number of care events per day"
            data={(stats?.hist || []).map((d: any) => ({ name: d.day.slice(5), value: d.count }))}
          />
        </section>

        <section className="rounded-2xl border bg-card text-card-foreground p-6">
          <h2 className="text-lg font-medium mb-4">Water vs ET₀ (7 days)</h2>
          <div className="grid grid-cols-7 gap-2">
            {(stats?.waterWeather || []).map((d: any) => (
              <div key={d.day} className="flex flex-col items-center gap-2">
                <div className="flex gap-1 items-end h-24">
                  <div
                    className="w-3 rounded-md bg-primary/20"
                    style={{ height: 4 + d.water * 8 }}
                    title={`${d.water} waterings`}
                  />
                  <div
                    className="w-3 rounded-md bg-secondary/20"
                    style={{ height: 4 + d.et0 * 8 }}
                    title={`ET₀ ${d.et0}`}
                  />
                </div>
                <div className="text-[10px] text-muted-foreground">{d.day.slice(5)}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-4 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-primary/20" /> Waterings
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-secondary/20" /> ET₀
            </div>
          </div>
        </section>

        <section className="rounded-2xl border bg-card text-card-foreground p-6">
          <h2 className="text-lg font-medium mb-4">Backup</h2>
          <BackupControls />
        </section>
      </div>
    </main>
  )
}
