import { describe, it, expect, beforeEach, vi } from "vitest";

process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.com";
process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";

vi.mock("@/lib/auth", () => ({
  getCurrentUserId: () => Promise.resolve("user-123"),
}));

let returnData: { feature_flags: Record<string, unknown> } | null;

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () =>
            Promise.resolve(
              returnData
                ? { data: returnData, error: null }
                : { data: null, error: { message: "not found" } },
            ),
        }),
      }),
    }),
  }),
}));

describe("GET /api/profile", () => {
  beforeEach(() => {
    returnData = { feature_flags: { beta: true } };
  });

  it("returns profile data with feature flags", async () => {
    const { GET } = await import("../src/app/api/profile/route");
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ id: "user-123", featureFlags: { beta: true } });
  });

  it("returns 404 when profile not found", async () => {
    returnData = null;
    const { GET } = await import("../src/app/api/profile/route");
    const res = await GET();
    expect(res.status).toBe(404);
  });
});

export {};
