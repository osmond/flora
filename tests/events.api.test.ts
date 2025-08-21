import { describe, it, expect, vi } from "vitest";

process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.com";
process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";

vi.mock("@/lib/auth", () => ({
  getCurrentUserId: () => "user-123",
}));

vi.mock("@/lib/cloudinary", () => ({
  uploader: { upload_stream: () => ({ end: () => {} }) },
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: (table: string) => {
      if (table === "plants") {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({
                single: () =>
                  Promise.resolve({

                    data: { id: "4aa97bee-71f1-428e-843b-4c3c77493994" },

                    error: null,
                  }),
              }),
            }),
          }),
        };
      }
      if (table === "events") {
        return {
          insert: () => ({
            select: () => Promise.resolve({ data: [{ id: "1" }], error: null }),
          }),
        };
      }

      return {} as unknown as Record<string, never>;

    },
  }),
}));

describe("POST /api/events", () => {
  it("returns 200 for valid submission", async () => {
    const { POST } = await import("../src/app/api/events/route");
    const req = new Request("http://localhost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({

        plant_id: "4aa97bee-71f1-428e-843b-4c3c77493994",
        type: "note",
        note: "hello",

      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("returns 400 when required fields are missing", async () => {
    const { POST } = await import("../src/app/api/events/route");
    const req = new Request("http://localhost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plant_id: "1" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid field types", async () => {
    const { POST } = await import("../src/app/api/events/route");
    const req = new Request("http://localhost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plant_id: "not-a-uuid", type: "note" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
