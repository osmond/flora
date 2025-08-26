import { describe, it, expect, vi, beforeEach } from "vitest";

process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.com";
process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";

const plantUpsert = vi.fn().mockResolvedValue({ error: null });
const eventUpsert = vi.fn().mockResolvedValue({ error: null });

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: (table: string) => {
      if (table === "plants") {
        return { upsert: plantUpsert };
      }
      if (table === "events") {
        return { upsert: eventUpsert };
      }
      return {} as unknown as Record<string, never>;
    },
  }),
}));

describe("POST /api/import", () => {
  beforeEach(() => {
    plantUpsert.mockClear();
    eventUpsert.mockClear();
  });
  it("imports plants and events", async () => {
    const { POST } = await import("../src/app/api/import/route");
    const payload = {
      plants: [
        {
          id: "123e4567-e89b-12d3-a456-426614174000",
          user_id: "u1",
          nickname: "Fern",
          species_scientific: "Fernae",
        },
      ],
      events: [
        {
          plant_id: "123e4567-e89b-12d3-a456-426614174000",
          user_id: "u1",
          type: "water",
        },
      ],
    };
    const req = new Request("http://localhost/api/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(plantUpsert).toHaveBeenCalledWith(payload.plants, { onConflict: "id" });
    expect(eventUpsert).toHaveBeenCalledWith(payload.events, { onConflict: "id" });
  });

  it("validates schema and returns 400", async () => {
    const { POST } = await import("../src/app/api/import/route");
    const req = new Request("http://localhost/api/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plants: [{}], events: [] }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
