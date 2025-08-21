import { describe, it, expect, vi } from "vitest";

process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.com";
process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";

vi.mock("@/lib/auth", () => ({
  getCurrentUserId: () => "user-123",
}));

const insertMock = vi.fn().mockResolvedValue({ error: null });
const selectMock = vi.fn().mockReturnValue({
  eq: () => ({
    eq: () => ({
      single: () => Promise.resolve({ data: { id: "plant-1" }, error: null }),
    }),
  }),
});

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: (table: string) => {
      if (table === "plants") {
        return { select: selectMock };
      }
      if (table === "events") {
        return { insert: insertMock };
      }
      return {} as Record<string, never>;
    },
  }),
}));

describe("POST /api/care-feedback", () => {
  it("records feedback", async () => {
    const { POST } = await import("../src/app/api/care-feedback/route");
    const req = new Request("http://localhost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plant_id: "4aa97bee-71f1-428e-843b-4c3c77493994",
        feedback: "helpful",
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(insertMock).toHaveBeenCalled();
  });
});
