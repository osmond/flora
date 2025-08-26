import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET as DashboardGET } from "@/app/api/dashboard/route"

// Freeze time for deterministic results
vi.setSystemTime(new Date("2025-01-08T12:00:00Z"))

// Mock supabase client used in the route
vi.mock("@supabase/supabase-js", () => {
  const events = [
    { id: 1, created_at: "2025-01-08T09:00:00Z", plant_id: 1, type: "water" },
    { id: 2, created_at: "2025-01-07T09:00:00Z", plant_id: 1, type: "water" },
    { id: 3, created_at: "2025-01-06T09:00:00Z", plant_id: 2, type: "fertilize" },
  ]
  const plants = [
    { id: 1, name: "Aloe", created_at: "2025-01-01" },
    { id: 2, name: "Fern", created_at: "2025-01-05" },
    { id: 3, name: "Cactus", created_at: "2024-01-01" },
  ]
  const tasks = [
    { id: 1, plant_id: 1, type: "water", due_date: "2025-01-07", completed_at: null },
    { id: 2, plant_id: 2, type: "fertilize", due_date: "2025-01-08", completed_at: "2025-01-08" },
  ]

  function createClient(_url: string, _key: string) {
    return {
      from(table: string) {
        if (table === "events") {
          return {
            select() {
              return { data: events, error: null }
            },
          }
        }
        if (table === "plants") {
          return {
            select() {
              return { data: plants, error: null }
            },
          }
        }
        if (table === "tasks") {
          return {
            select() {
              return {
                lte() {
                  return {
                    order() {
                      return { data: tasks, error: null }
                    },
                  }
                },
              }
            },
          }
        }
        throw new Error("Unexpected table: " + table)
      },
    }
  }
  return { createClient }
})

beforeEach(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost"
  process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "test_key"
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      daily: {
        time: [
          "2025-01-02",
          "2025-01-03",
          "2025-01-04",
          "2025-01-05",
          "2025-01-06",
          "2025-01-07",
          "2025-01-08",
        ],
        et0_fao_evapotranspiration: [1, 1, 1, 1, 1, 1, 1],
      },
    }),
  })
})

describe("/api/dashboard", () => {
  it("returns computed stats", async () => {
    const res = await DashboardGET()
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toMatchObject({
      completion: 100,
      totalDone: 3,
      plants: 3,
      streak: 3,
    })
    expect(json.attention).toHaveLength(1)
    expect(json.attention[0].plantName).toBe("Aloe")
    expect(Array.isArray(json.hist)).toBe(true)
    expect(json.hist).toHaveLength(7)
    expect(Array.isArray(json.overdueTrend)).toBe(true)
    expect(json.overdueTrend).toHaveLength(7)
    expect(Array.isArray(json.waterWeather)).toBe(true)
    expect(json.waterWeather).toHaveLength(7)
    expect(Array.isArray(json.neglected)).toBe(true)
    expect(json.neglected[0].plantName).toBe("Cactus")
    expect(json.neglected[0].days).toBeGreaterThan(300)
    expect(Array.isArray(json.longestStreaks)).toBe(true)
    expect(json.longestStreaks[0]).toMatchObject({ plantName: "Aloe", streak: 2 })
  })
})

