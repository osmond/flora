import { describe, it, expect, vi, beforeEach } from "vitest";

process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.com";
process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";

describe("GET /api/rooms", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns descriptive error when env vars are missing", async () => {
    const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    const { GET } = await import("../src/app/api/rooms/route");
    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body.error).toContain("NEXT_PUBLIC_SUPABASE_URL");
    expect(body.error).toContain("SUPABASE_SERVICE_ROLE_KEY");

    process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
    process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey;
  });
});

export {};

