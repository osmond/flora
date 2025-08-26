import { describe, it, expect, vi } from "vitest";

process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.com";
process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";

vi.mock("../src/lib/aiCare", () => ({
  getAiCareSuggestions: vi.fn().mockResolvedValue(["Test suggestion"]),
  getAiCareAnswer: vi.fn().mockResolvedValue("Test answer"),
}));

describe("GET /api/ai-care", () => {
  it("returns 400 when plantId is missing", async () => {
    const { GET } = await import("../src/app/api/ai-care/route");
    const res = await GET(new Request("http://localhost/api/ai-care"));
    expect(res.status).toBe(400);
  });

  it("returns suggestions when plantId is provided", async () => {
    const { GET } = await import("../src/app/api/ai-care/route");
    const res = await GET(
      new Request("http://localhost/api/ai-care?plantId=123"),
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.suggestions).toEqual(["Test suggestion"]);
  });

  it("returns answer when question is provided", async () => {
    const { GET } = await import("../src/app/api/ai-care/route");
    const res = await GET(
      new Request(
        "http://localhost/api/ai-care?plantId=123&q=How%27s%20Kay%20doing%3F",
      ),
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.answer).toBe("Test answer");
  });
});
