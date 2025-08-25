import { describe, it, expect } from "vitest";

process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.com";
process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";

describe("POST /api/ai-care", () => {
  it("uses inches in rationale when potUnit is 'in'", async () => {
    const { POST } = await import("../src/app/api/ai-care/route");
    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ potSize: 25.4, potUnit: "in" }),
    });
    const res = await POST(req);
    const json = await res.json();
    expect(json.rationale).toContain("10in");
  });

  it("uses centimeters in rationale when potUnit is 'cm'", async () => {
    const { POST } = await import("../src/app/api/ai-care/route");
    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ potSize: 10, potUnit: "cm" }),
    });
    const res = await POST(req);
    const json = await res.json();
    expect(json.rationale).toContain("10cm");
  });

  it("returns a confidence rating", async () => {
    const { POST } = await import("../src/app/api/ai-care/route");
    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ species: "rose", potSize: 10, potUnit: "cm" }),
    });
    const res = await POST(req);
    const json = await res.json();
    expect(json.confidence).toBe("medium");
  });

  it("returns 400 for invalid data", async () => {
    const { POST } = await import("../src/app/api/ai-care/route");
    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ potSize: 10, potUnit: "mm" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Invalid data");
  });
});
