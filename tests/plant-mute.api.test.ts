import { describe, it, expect, vi } from "vitest";

process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.com";
process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";

const updates: Record<string, unknown>[] = [];

vi.mock("@/lib/auth", () => ({
  getCurrentUserId: () => Promise.resolve("user-123"),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: () => ({
      update: (values: Record<string, unknown>) => {
        updates.push(values);
        return {
          eq: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: {}, error: null }),
            }),
          }),
        };
      },
    }),
  }),
}));

describe("PATCH /api/plants/[id]", () => {
  it("updates notifications_muted when provided", async () => {
    const { PATCH } = await import("../src/app/api/plants/[id]/route");
    const req = new Request("http://localhost", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationsMuted: true }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: "plant-1" }) });
    expect(res.status).toBe(200);
    expect(updates[0].notifications_muted).toBe(true);
  });
});

export {};
