import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET as ExportGET } from "@/app/api/export/route";

vi.mock("@supabase/supabase-js", () => {
  function createClient(_url: string, _key: string) {
    return {
      from(table: string) {
        if (table === "plants") {
          return {
            select() {
              return { data: [{ id: "1", nickname: "Aloe" }], error: null };
            },
          };
        }
        if (table === "events") {
          return {
            select() {
              return { data: [{ id: "1", plant_id: "1", type: "water" }], error: null };
            },
          };
        }
        throw new Error("Unexpected table: " + table);
      },
    };
  }
  return { createClient };
});

beforeEach(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost";
  process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "test_key";
});

describe("/api/export route", () => {
  it("returns plants and events as JSON by default", async () => {
    const req = new Request("http://localhost/api/export");
    const res = await ExportGET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({
      plants: [{ id: "1", nickname: "Aloe" }],
      events: [{ id: "1", plant_id: "1", type: "water" }],
    });
  });

  it("returns CSV when format=csv", async () => {
    const req = new Request("http://localhost/api/export?format=csv");
    const res = await ExportGET(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("text/csv");
    const text = await res.text();
    expect(text).toContain("plants");
    expect(text).toContain("events");
    expect(text).toContain("Aloe");
    expect(text).toContain("water");
  });
});
