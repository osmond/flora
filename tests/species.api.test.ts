import { describe, it, expect, vi, beforeEach } from "vitest";

process.env.OPENAI_API_KEY = "test-key";

describe("GET /api/species", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns cached results for repeated queries", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo) => {
      if (typeof input === "string" && input.includes("api.openai.com")) {
        return new Response(
          JSON.stringify({ choices: [{ message: { content: "[]" } }] }),
          { status: 200 }
        );
      }
      throw new Error(`Unexpected fetch call: ${input}`);
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const { GET } = await import("../src/app/api/species/route");

    const req = new Request("http://localhost/api/species?q=rose");
    await GET(req);
    await GET(req);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("evicts the oldest entry when cache exceeds limit", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo) => {
      if (typeof input === "string" && input.includes("api.openai.com")) {
        return new Response(
          JSON.stringify({ choices: [{ message: { content: "[]" } }] }),
          { status: 200 }
        );
      }
      throw new Error(`Unexpected fetch call: ${input}`);
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const { GET } = await import("../src/app/api/species/route");

    const firstReq = new Request("http://localhost/api/species?q=0");
    await GET(firstReq);
    await GET(firstReq);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    for (let i = 1; i <= 100; i++) {
      const req = new Request(`http://localhost/api/species?q=${i}`);
      await GET(req);
    }

    const reqAgain = new Request("http://localhost/api/species?q=0");
    await GET(reqAgain);
    expect(fetchMock).toHaveBeenCalledTimes(102);
  });
});

export {};
