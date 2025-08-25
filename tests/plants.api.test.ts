import { describe, it, expect, vi, beforeEach } from "vitest";

process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.com";
process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";

vi.mock("@/lib/auth", () => ({
  getCurrentUserId: () => Promise.resolve("user-123"),
}));

vi.mock("@/lib/db", () => ({ default: { photo: { create: vi.fn() } } }));

let inserted: Record<string, unknown> | null;
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: () => ({
      insert: (payload: Record<string, unknown>) => {
        inserted = payload;
        return {
          select: () => Promise.resolve({ data: [payload], error: null }),
        };
      },
      delete: () => ({
        eq: () => ({
          eq: () => Promise.resolve({ error: null }),
        }),
      }),
      select: () => ({
        eq: (col: string) =>
          col === "id"
            ? { eq: () => Promise.resolve({ data: [{ id: "1" }], error: null }) }
            : Promise.resolve({ data: [{ id: "1" }], error: null }),
      }),
    }),
  }),
}));

describe("POST /api/plants", () => {
  beforeEach(() => {
    inserted = null;
  });

  it("returns 200 for valid submission", async () => {
    const { POST } = await import("../src/app/api/plants/route");
    const form = new FormData();
    form.set("name", "Fern");
    form.set("species", "Pteridophyta");
    const req = new Request("http://localhost", { method: "POST" }) as Request & {
      formData: () => Promise<FormData>;
    };
    req.formData = () => Promise.resolve(form);
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("returns 400 when required fields are missing", async () => {
    const { POST } = await import("../src/app/api/plants/route");
    const form = new FormData();
    form.set("species", "Pteridophyta");
    const req = new Request("http://localhost", { method: "POST" }) as Request & {
      formData: () => Promise<FormData>;
    };
    req.formData = () => Promise.resolve(form);
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("falls back to 'Unknown' when species is missing", async () => {
    const { POST } = await import("../src/app/api/plants/route");
    const form = new FormData();
    form.set("name", "Fern");
    const req = new Request("http://localhost", { method: "POST" }) as Request & {
      formData: () => Promise<FormData>;
    };
    req.formData = () => Promise.resolve(form);
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(inserted.species).toBe("Unknown");
  });

  it("returns 400 for invalid field types", async () => {
    const { POST } = await import("../src/app/api/plants/route");
    const form = new FormData();
    form.set("name", "Fern");
    form.set("species", "Pteridophyta");
    form.set("latitude", "not-a-number");
    const req = new Request("http://localhost", { method: "POST" }) as Request & {
      formData: () => Promise<FormData>;
    };
    req.formData = () => Promise.resolve(form);
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe("GET /api/plants", () => {
  it("returns list of plants", async () => {
    const { GET } = await import("../src/app/api/plants/route");
    const req = new Request("http://localhost", { method: "GET" });
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual([{ id: "1" }]);
  });
});

describe("GET /api/plants/[id]", () => {
  it("returns a single plant", async () => {
    const { GET } = await import("../src/app/api/plants/[id]/route");
    const req = new Request("http://localhost", { method: "GET" });
    const res = await GET(req, { params: Promise.resolve({ id: "1" }) });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ id: "1" });
  });
});

describe("DELETE /api/plants/[id]", () => {
  it("returns 200 when deleting a plant", async () => {
    const { DELETE } = await import("../src/app/api/plants/[id]/route");
    const req = new Request("http://localhost", { method: "DELETE" });
    const res = await DELETE(req, { params: Promise.resolve({ id: "1" }) });
    expect(res.status).toBe(200);
  });
});
