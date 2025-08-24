import { describe, it, expect, vi, beforeEach } from "vitest";

process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.com";
process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";

const logEvent = vi.fn();
let taskUpdates: Record<string, unknown>[] = [];
let plantCarePlan: Record<string, unknown> | null = null;
let eventInserts: Record<string, unknown>[] = [];

vi.mock("@/lib/auth", () => ({
  getCurrentUserId: () => "user-123",
}));

vi.mock("@/lib/analytics", () => ({
  logEvent,
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: (table: string) => {
      if (table === "tasks") {
        return {
          update: (values: Record<string, unknown>) => {
            taskUpdates.push(values);
            return {
              eq: () => ({
                eq: () => Promise.resolve({ error: null }),
              }),
            };
          },
          select: () => ({
            eq: () => ({
              eq: () => ({
                single: () =>
                  Promise.resolve({
                    data: {
                      due_date: "2024-01-01",
                      plant_id: "plant-1",
                      type: "water",
                    },
                    error: null,
                  }),
              }),
            }),
          }),
        };
      }
      if (table === "plants") {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({
                single: () =>
                  Promise.resolve({
                    data: { care_plan: { waterEvery: "7 days" } },
                    error: null,
                  }),
              }),
            }),
          }),
          update: (values: Record<string, unknown>) => {
            plantCarePlan = values.care_plan as Record<string, unknown>;
            return {
              eq: () => ({
                eq: () => Promise.resolve({ error: null }),
              }),
            };
          },
        };
      }
      if (table === "events") {
        return {
          insert: (values: Record<string, unknown>) => {
            eventInserts.push(values);
            return Promise.resolve({ error: null });
          },
        };
      }
      return {} as unknown as Record<string, never>;
    },
  }),
}));

describe("PATCH /api/tasks/[id]", () => {
  beforeEach(() => {
    taskUpdates = [];
    plantCarePlan = null;
    eventInserts = [];
    logEvent.mockReset();
  });

  it("marks a task as complete and logs the event", async () => {
    const { PATCH } = await import("../src/app/api/tasks/[id]/route");
    const req = new Request("http://localhost", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "complete" }),
    });
    const res = await PATCH(req, { params: { id: "1" } });
    expect(res.status).toBe(200);
    expect(taskUpdates[0]).toHaveProperty("completed_at");
    expect(eventInserts[0]).toEqual({ plant_id: "plant-1", type: "water" });
    expect(logEvent).toHaveBeenCalledWith("task_completed", { task_id: "1" });
  });

  it("snoozes a task and updates care plan when soil is wet", async () => {
    const { PATCH } = await import("../src/app/api/tasks/[id]/route");
    const req = new Request("http://localhost", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "snooze",
        days: 1,
        reason: "Soil still wet",
      }),
    });
    const res = await PATCH(req, { params: { id: "1" } });
    expect(res.status).toBe(200);
    expect(taskUpdates[0]).toEqual({
      due_date: "2024-01-02",
      snooze_reason: "Soil still wet",
    });
    expect(plantCarePlan).toEqual({ waterEvery: "8 days" });
    expect(logEvent).not.toHaveBeenCalled();
  });
});

export {};
