import { describe, it, expect, vi, beforeEach } from "vitest";

process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.com";
process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";

let upserted: Record<string, unknown> | null = null;

vi.mock("@/lib/auth", () => ({
  getCurrentUserId: () => Promise.resolve("user-123"),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: (table: string) => {
      if (table === "notification_settings") {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: () => Promise.resolve({ data: { quiet_start: "22:00", quiet_end: "07:00" }, error: null }),
            }),
          }),
          upsert: (values: Record<string, unknown>) => {
            upserted = values;
            return {
              select: () => ({
                single: () => Promise.resolve({ data: values, error: null }),
              }),
            };
          },
        };
      }
      return {} as any;
    },
  }),
}));

describe("/api/notifications/settings", () => {
  beforeEach(() => {
    upserted = null;
  });

  it("returns existing settings", async () => {
    const { GET } = await import("../src/app/api/notifications/settings/route");
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.settings).toEqual({ quiet_start: "22:00", quiet_end: "07:00" });
  });

  it("upserts settings on PATCH", async () => {
    const { PATCH } = await import("../src/app/api/notifications/settings/route");
    const req = new Request("http://localhost", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quietStart: "21:00", quietEnd: "06:00" }),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(200);
    expect(upserted).toEqual({ user_id: "user-123", quiet_start: "21:00", quiet_end: "06:00" });
  });
});

export {};
