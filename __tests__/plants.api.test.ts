import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET as PlantsGET, POST as PlantsPOST } from "@/app/api/plants/route"

// Minimal mock for @supabase/supabase-js createClient used in the route
vi.mock("@supabase/supabase-js", () => {
  function createClient(_url: string, _key: string) {
    return {
      from(table: string) {
        if (table !== "plants") throw new Error("Unexpected table: " + table)
        return {
          select() {
            return {
              order() {
                return { data: [], error: null }
              },
              single() {
                return { data: { id: 1, nickname: "Kay" }, error: null }
              },
            }
          },
          insert(_payload: any) {
            return {
              select() {
                return {
                  single() {
                    return { data: { id: 1, nickname: "Kay" }, error: null }
                  },
                }
              },
            }
          },
        }
      },
    }
  }
  return { createClient }
})

beforeEach(() => {
  // Set env expected by the server route
  process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321"
  process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "test_key"
})

describe("/api/plants route", () => {
  it("GET returns 200 with an array", async () => {
    const res = await PlantsGET()
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
  })

  it("POST creates and returns a plant", async () => {
    const req = new Request("http://localhost/api/plants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname: "Kay" }),
    })
    const res = await PlantsPOST(req as unknown as Request)
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json).toHaveProperty("plant")
    expect(json.plant).toHaveProperty("id")
  })
})
