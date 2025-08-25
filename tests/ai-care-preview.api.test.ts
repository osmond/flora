import { describe, it, expect } from "vitest";

describe("GET /api/ai-care/preview", () => {
  it("returns 400 when species is missing", async () => {
    const { GET } = await import("../src/app/api/ai-care/preview/route");
    const res = await GET(new Request("http://localhost/api/ai-care/preview"));
    expect(res.status).toBe(400);
  });

  it("returns preview when species provided", async () => {
    const { GET } = await import("../src/app/api/ai-care/preview/route");
    const res = await GET(
      new Request("http://localhost/api/ai-care/preview?species=Pothos"),
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.preview).toContain("Pothos");
  });
});
