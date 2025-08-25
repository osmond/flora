import { describe, it, expect, vi, beforeEach } from "vitest";

process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.com";
process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";

vi.mock("@/lib/auth", () => ({
  getCurrentUserId: () => Promise.resolve("user-123"),
}));

const tasksData = [
  { id: "1", plant_id: "p1", type: "water", due_date: "2024-01-01", completed_at: null },
  { id: "2", plant_id: "p2", type: "fertilize", due_date: "2024-01-02", completed_at: "2024-01-01" },
];
const plantsData = [
  { id: "p1", nickname: "Aloe" },
  { id: "p2", nickname: "Snake" },
];

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: (table: string) => {
      if (table === "tasks") {
        return {
          select: () => ({
            eq: () => ({
              lte: () => ({
                is: () => ({
                  order: () =>
                    Promise.resolve({
                      data: tasksData.filter((t) => t.completed_at === null),
                      error: null,
                    }),
                }),
              }),
            }),
          }),
        };
      }
      if (table === "plants") {
        return {
          select: () => ({
            eq: () => Promise.resolve({ data: plantsData, error: null }),
          }),
        };
      }
      return {} as Record<string, never>;
    },
  }),
}));

describe("GET /api/tasks", () => {
  beforeEach(() => {
    // reset if needed
  });

  it("returns pending tasks with plant names", async () => {
    const { GET } = await import("../src/app/api/tasks/route");
    const req = new Request("http://localhost/api/tasks");
    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.tasks).toHaveLength(1);
    expect(json.tasks[0]).toEqual({
      id: "1",
      plantId: "p1",
      plantName: "Aloe",
      type: "water",
      due: "2024-01-01",
    });
  });
});

export {};
