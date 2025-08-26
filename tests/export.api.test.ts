import { describe, it, expect, vi } from "vitest";

process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.com";
process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: (table: string) => ({
      select: () => {
        if (table === "plants") {
          return Promise.resolve({ data: [{ id: 1, nickname: "Fern" }], error: null });
        }
        return Promise.resolve({ data: [{ id: 10, plant_id: 1, type: "water" }], error: null });
      },
    }),
  }),
}));

describe("GET /api/export", () => {
  it("returns plants and events in JSON by default", async () => {
    const { GET } = await import("../src/app/api/export/route");
    const req = new Request("http://localhost/api/export");
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({
      plants: [{ id: 1, nickname: "Fern" }],
      events: [{ id: 10, plant_id: 1, type: "water" }],
    });
  });

  it("returns CSV when format=csv", async () => {
    const { GET } = await import("../src/app/api/export/route");
    const req = new Request("http://localhost/api/export?format=csv");
    const res = await GET(req);
    const text = await res.text();
    expect(res.headers.get("Content-Type")).toBe("text/csv");
    expect(text).toContain("plants");
    expect(text).toContain("events");
    expect(text).toContain("Fern");
    expect(text).toContain("water");
  });
});
