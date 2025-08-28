import { NextResponse } from "next/server"
import { supabaseServer, SupabaseEnvError } from "@/lib/supabase/server"
import { isDemoMode } from "@/lib/server-demo"
import { buildDemoEvents, getDemoPlants } from "@/lib/demoData"

export async function GET() {
  try {
    if (await isDemoMode()) {
      const demo = getDemoPlants()
      const plants = demo.map(p => ({ id: p.id, name: p.nickname, created_at: new Date().toISOString() }))
      const events = buildDemoEvents(1, demo)
      const since = new Date(Date.now() - 7 * 86400000).toISOString()
      const recentEvents = events.filter(e => e.created_at >= since)

      const todayStr = new Date().toISOString().slice(0, 10)
      const tasks = plants.flatMap((p) => (
        Array.from({ length: 5 }, (_, i) => {
          const day = new Date(); day.setDate(day.getDate() - i)
          const due_date = day.toISOString().slice(0, 10)
          const completed_at = i % 2 === 0 ? new Date(day.getTime() + 12 * 3600000).toISOString() : null
          return { id: `${p.id}-${i}`, plant_id: p.id, type: i % 3 === 0 ? 'fertilize' : 'water', due_date, completed_at }
        })
      ))

      const attention = tasks
        .filter(t => !t.completed_at && t.due_date <= todayStr)
        .slice(0, 5)
        .map(t => ({ id: t.id, plantName: plants.find(p => p.id === t.plant_id)?.name || 'Unknown', type: t.type, due: t.due_date }))

      const now = Date.now()
      const neglected = plants
        .map(p => {
          const last = events.filter(e => e.plant_id === p.id).map(e => new Date(e.created_at).getTime()).reduce((m, t) => t > m ? t : m, 0)
          const baseline = last || new Date().getTime() - 10 * 86400000
          const days = Math.floor((now - baseline) / 86400000)
          return { id: p.id, plantName: p.name, days }
        })
        .filter(p => p.days >= 5)
        .sort((a, b) => b.days - a.days)
        .slice(0, 5)

      const totalExpected = plants.length * 1
      const totalDone = recentEvents.length
      const completion = totalExpected === 0 ? 0 : Math.min(100, Math.round((totalDone / totalExpected) * 100))

      const hist = Array.from({ length: 7 }, (_, i) => {
        const dayStart = new Date(); dayStart.setHours(0,0,0,0); dayStart.setDate(dayStart.getDate() - i)
        const day = dayStart.toISOString().slice(0,10)
        const count = recentEvents.filter(e => e.created_at.slice(0,10) === day).length
        return { day, count }
      }).reverse()

      const overdueTrend = Array.from({ length: 7 }, (_, i) => {
        const dayStart = new Date(); dayStart.setHours(0,0,0,0); dayStart.setDate(dayStart.getDate() - i)
        const dayEnd = new Date(dayStart); dayEnd.setDate(dayStart.getDate() + 1)
        const count = tasks.filter(t => {
          const due = new Date(t.due_date).getTime()
          const completed = t.completed_at ? new Date(t.completed_at).getTime() : null
          return due < dayEnd.getTime() && (!completed || completed >= dayEnd.getTime())
        }).length
        return { day: dayStart.toISOString().slice(0,10), count }
      }).reverse()

      const waterWeather = hist.map(h => ({ day: h.day, et0: 0, water: recentEvents.filter(e => e.type==='water' && e.created_at.slice(0,10)===h.day).length }))

      let streak = 0
      for (let i=0;i<30;i++){
        const dayStart = new Date(); dayStart.setHours(0,0,0,0); dayStart.setDate(dayStart.getDate() - i)
        const day = dayStart.toISOString().slice(0,10)
        const has = events.some(e => e.created_at.slice(0,10) === day)
        if (has) streak++; else break
      }

      const longestStreaks = plants.map(p => {
        const days = Array.from(new Set(events.filter(e=>e.plant_id===p.id).map(e=>e.created_at.slice(0,10)))).sort()
        let max=0, cur=0, prev: string | undefined
        for (const d of days){
          if (prev && new Date(d).getTime() === new Date(prev).getTime()+86400000) cur++; else cur=1
          if (cur>max) max=cur; prev=d
        }
        return { id: p.id, plantName: p.name, streak: max }
      }).filter(s=>s.streak>0).sort((a,b)=>b.streak-a.streak).slice(0,5)

      return NextResponse.json({
        completion,
        totalDone,
        totalExpected,
        hist,
        overdueTrend,
        waterWeather,
        streak,
        longestStreaks,
        plants: plants.length,
        attention,
        neglected,
      }, { status: 200 })
    }
    const supabase = supabaseServer()

    // Weekly completion (approx): last 7d events count vs plants*expected(1)
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    let recentEvents: any[] = []
    try {
      const { data: events } = await supabase
        .from("events")
        .select("id, created_at, plant_id, type")
      recentEvents = (events || []).filter(e => e.created_at >= since)
    } catch {}

    let plants: any[] = []
    try {
      const { data } = await supabase
        .from("plants")
        .select("id, nickname, created_at")
      plants = data || []
    } catch {}

    const todayStr = new Date().toISOString().slice(0, 10)

    let tasks: any[] = []
    try {
      const { data } = await supabase
        .from("tasks")
        .select("id, plant_id, type, due_date, completed_at")
        .lte("due_date", todayStr)
        .order("due_date", { ascending: true })
      tasks = data || []
    } catch {}

    const attention = (tasks || [])
      .filter(t => !t.completed_at)
      .slice(0, 5)
      .map(t => ({
        id: t.id,
        plantName: (plants || []).find(p => p.id === t.plant_id)?.nickname || "Unknown",
        type: t.type,
        due: t.due_date,
      }))

    // Neglected plants: longest time since last event (or creation)
    const now = Date.now()
    const neglected = (plants || [])
      .map(p => {
        const lastEvent = (recentEvents || [])
          .filter(e => e.plant_id === p.id)
          .map(e => new Date(e.created_at).getTime())
          .reduce((max, t) => (t > max ? t : max), 0)
        const baseline = lastEvent || new Date(p.created_at).getTime()
        const days = Math.floor((now - baseline) / (1000 * 60 * 60 * 24))
        return { id: p.id, plantName: (p as any).nickname || 'Unknown', days }
      })
      .filter(p => p.days >= 14)
      .sort((a, b) => b.days - a.days)
      .slice(0, 5)

    const totalExpected = (plants?.length || 0) * 1 // naive: 1 action per plant per week
    const totalDone = recentEvents.length
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
      const count = recentEvents.filter(e => {
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

    // Weather vs watering: ET₀ vs daily water events
    const lat = process.env.WEATHER_LAT || "40.71"
    const lon = process.env.WEATHER_LON || "-74.01"
    let waterWeather: { day: string; et0: number; water: number }[] = []
    try {
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=et0_fao_evapotranspiration&past_days=7&timezone=auto`
      )
      if (weatherRes.ok) {
        const w = await weatherRes.json()
        const times: string[] = w.daily?.time || []
        const et0: number[] = w.daily?.et0_fao_evapotranspiration || []
        waterWeather = times.map((day: string, idx: number) => ({
          day,
          et0: et0[idx] ?? 0,
          water: recentEvents.filter(
            e => e.type === "water" && e.created_at.slice(0, 10) === day
          ).length,
        }))
      }
    } catch {
      // ignore weather fetch errors
    }

    // Streak: consecutive days with at least one event
    let streak = 0
    for (let i = 0; i < 30; i++) {
      const dayStart = new Date()
      dayStart.setHours(0, 0, 0, 0)
      dayStart.setDate(dayStart.getDate() - i)
      const dayEnd = new Date(dayStart)
      dayEnd.setDate(dayStart.getDate() + 1)
      const has = (recentEvents || []).some(e => {
        const t = new Date(e.created_at).getTime()
        return t >= dayStart.getTime() && t < dayEnd.getTime()
      })
      if (has) streak++
      else break
    }

    // Longest streak per plant
    const longestStreaks = (plants || [])
      .map(p => {
        const days = Array.from(
          new Set(
            (recentEvents || [])
              .filter(e => e.plant_id === p.id)
              .map(e => e.created_at.slice(0, 10))
          )
        ).sort()
        let max = 0
        let current = 0
        let prev: string | null = null
        for (const day of days) {
          if (prev && new Date(day).getTime() === new Date(prev).getTime() + 86400000) {
            current++
          } else {
            current = 1
          }
          if (current > max) max = current
          prev = day
        }
        return { id: p.id, plantName: (p as any).nickname || 'Unknown', streak: max }
      })
      .filter(s => s.streak > 0)
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 5)

    return NextResponse.json(
      {
        completion,
        totalDone,
        totalExpected,
        hist,
        overdueTrend,
        waterWeather,
        streak,
        longestStreaks,
        plants: plants?.length || 0,
        attention,
        neglected,
      },
      { status: 200 }
    )
  } catch (e: unknown) {
    if (e instanceof SupabaseEnvError) {
      return NextResponse.json({ error: e.message }, { status: 503 })
    }
    const msg = e instanceof Error ? e.message : "Server error"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
