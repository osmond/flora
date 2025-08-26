import { describe, it, expect, vi } from "vitest";

process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.com";
process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";

const today = new Date().toISOString().slice(0, 10);
const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

vi.mock("@/lib/auth", () => ({
  getCurrentUserId: () => Promise.resolve("user-123"),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          is: () => ({
            lte: () =>
              Promise.resolve({
                data: [
                  { id: "1", plant_id: "p1", type: "water", due_date: today },
                  { id: "2", plant_id: "p2", type: "fertilize", due_date: yesterday },
                ],
                error: null,
              }),
          }),
        }),
      }),
    }),
  }),
}));

describe("GET /api/notifications/digest", () => {
  it("summarizes due tasks", async () => {
    const { GET } = await import("../src/app/api/notifications/digest/route");
    const req = new Request("http://localhost/api/notifications/digest");
    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({
      ok: true,
      summary: "You have 2 tasks due or overdue today.",
      tasks: [
        { id: "1", plant_id: "p1", type: "water", due_date: today },
        { id: "2", plant_id: "p2", type: "fertilize", due_date: yesterday },
      ],
    });
  });
});

export {};
