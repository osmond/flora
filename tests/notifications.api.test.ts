import { describe, it, expect } from "vitest";

describe("GET /api/notifications/test", () => {
  it("returns a simulated reminder payload with a provided recipient", async () => {
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
        deepLink: "/today",
      },
    });
  });

  it("falls back to a default test address when none provided", async () => {
    const { GET } = await import("../src/app/api/notifications/test/route");
    const req = new Request("http://localhost/api/notifications/test");
    const res = await GET(req);
    const body = await res.json();
    expect(body.payload.to).toBe("test@example.com");
  });
});

export {};
