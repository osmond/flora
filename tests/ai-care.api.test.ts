import { describe, it, expect } from "vitest";

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
});
