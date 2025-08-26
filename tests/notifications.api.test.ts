import { describe, it, expect, afterEach } from "vitest";

const ORIGINAL_BASE = process.env.NEXT_PUBLIC_BASE_URL;

describe("GET /api/notifications/test", () => {
  afterEach(() => {
    if (ORIGINAL_BASE) process.env.NEXT_PUBLIC_BASE_URL = ORIGINAL_BASE;
    else delete process.env.NEXT_PUBLIC_BASE_URL;
  });

  it("returns a simulated reminder payload with a provided recipient and deep link", async () => {
    process.env.NEXT_PUBLIC_BASE_URL = "https://app.example";
    const { GET } = await import("../src/app/api/notifications/test/route");
    const req = new Request("http://localhost/api/notifications/test?to=user@example.com");
    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({
      ok: true,
      payload: {
        to: "user@example.com",
        subject: "Flora — You have tasks due today",
        body: "Open Flora and check your Today list.",
        deepLink: "https://app.example/today",
      },
    });
  });

  it("falls back to a default test address when none provided", async () => {
    delete process.env.NEXT_PUBLIC_BASE_URL;
    const { GET } = await import("../src/app/api/notifications/test/route");
    const req = new Request("http://localhost/api/notifications/test");
    const res = await GET(req);
    const body = await res.json();
    expect(body.payload.to).toBe("test@example.com");
    expect(body.payload.deepLink).toBe("/today");
  });
});

export {};
