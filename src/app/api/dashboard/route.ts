import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function supabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  if (!url || !key) throw new Error("Missing SUPABASE env vars")
  return createClient(url, key, { auth: { persistSession: false } })
}

export async function GET() {
  try {
    const supabase = supabaseServer()

    // Weekly completion (approx): last 7d events count vs plants*expected(1)
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const { data: events, error: evErr } = await supabase
      .from("events")
      .select("id, created_at, plant_id, type")
      .gte("created_at", since)

    if (evErr) throw evErr

    const { data: plants, error: pErr } = await supabase
      .from("plants")
      .select("id, name")

    if (pErr) throw pErr

    const todayStr = new Date().toISOString().slice(0, 10)

    const { data: tasks, error: tErr } = await supabase
      .from("tasks")
      .select("id, plant_id, type, due_date, completed_at")
      .lte("due_date", todayStr)
      .order("due_date", { ascending: true })

    if (tErr) throw tErr

    const attention = (tasks || [])
      .filter(t => !t.completed_at)
      .slice(0, 5)
      .map(t => ({
        id: t.id,
        plantName: (plants || []).find(p => p.id === t.plant_id)?.name || "Unknown",
        type: t.type,
        due: t.due_date,
      }))

    const totalExpected = (plants?.length || 0) * 1 // naive: 1 action per plant per week
    const totalDone = events?.length || 0
    const completion =
      totalExpected === 0
        ? 0
        : Math.min(100, Math.round((totalDone / totalExpected) * 100))

    // Activity histogram (events per day, last 7 days)
    const hist = Array.from({ length: 7 }, (_, i) => {
      const dayStart = new Date()
      dayStart.setHours(0, 0, 0, 0)
      dayStart.setDate(dayStart.getDate() - i)
      const dayEnd = new Date(dayStart)
      dayEnd.setDate(dayStart.getDate() + 1)
      const count = (events || []).filter(e => {
        const t = new Date(e.created_at).getTime()
        return t >= dayStart.getTime() && t < dayEnd.getTime()
      }).length
      return { day: dayStart.toISOString().slice(0, 10), count }
    }).reverse()

    // Overdue trend: count overdue tasks for each of last 7 days
    const overdueTrend = Array.from({ length: 7 }, (_, i) => {
      const dayStart = new Date()
      dayStart.setHours(0, 0, 0, 0)
      dayStart.setDate(dayStart.getDate() - i)
      const dayEnd = new Date(dayStart)
      dayEnd.setDate(dayStart.getDate() + 1)
      const count = (tasks || []).filter(t => {
        const due = new Date(t.due_date).getTime()
        const completed = t.completed_at ? new Date(t.completed_at).getTime() : null
        return due < dayEnd.getTime() && (!completed || completed >= dayEnd.getTime())
      }).length
      return { day: dayStart.toISOString().slice(0, 10), count }
    }).reverse()

    // Streak: consecutive days with at least one event
    let streak = 0
    for (let i = 0; i < 30; i++) {
      const dayStart = new Date()
      dayStart.setHours(0, 0, 0, 0)
      dayStart.setDate(dayStart.getDate() - i)
      const dayEnd = new Date(dayStart)
      dayEnd.setDate(dayStart.getDate() + 1)
      const has = (events || []).some(e => {
        const t = new Date(e.created_at).getTime()
        return t >= dayStart.getTime() && t < dayEnd.getTime()
      })
      if (has) streak++
      else break
    }

    return NextResponse.json(
      {
        completion,
        totalDone,
        totalExpected,
        hist,
        overdueTrend,
        streak,
        plants: plants?.length || 0,
        attention,
      },
      { status: 200 }
    )
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

