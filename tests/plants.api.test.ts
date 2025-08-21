import { describe, it, expect, vi } from "vitest";

process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.com";
process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";

vi.mock("../src/lib/auth", () => ({
  getCurrentUserId: () => "user-123",
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: () => ({
      insert: () => ({
        select: () => Promise.resolve({ data: [{ id: "1" }], error: null }),
      }),
    }),
  }),
}));

describe("POST /api/plants", () => {
  it("returns 200 for valid submission", async () => {
    const { POST } = await import("../src/app/api/plants/route");
    const form = new FormData();
    form.set("name", "Fern");
    form.set("species", "Pteridophyta");
    const req = new Request("http://localhost", { method: "POST", body: form });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("returns 400 when required fields are missing", async () => {
    const { POST } = await import("../src/app/api/plants/route");
    const form = new FormData();
    form.set("species", "Pteridophyta");
    const req = new Request("http://localhost", { method: "POST", body: form });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid field types", async () => {
    const { POST } = await import("../src/app/api/plants/route");
    const form = new FormData();
    form.set("name", "Fern");
    form.set("species", "Pteridophyta");
    form.set("latitude", "not-a-number");
    const req = new Request("http://localhost", { method: "POST", body: form });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
