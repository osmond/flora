import { describe, it, expect, vi, afterEach } from "vitest";

process.env.OPENAI_API_KEY = "test-key";

const mockResponse = [
  {
    id: "1",
    common_name: "Rose",
    scientific_name: "Rosa",
    image_url: "https://valid.example.com/rose.jpg",
  },
  {
    id: "2",
    common_name: "Orchid",
    scientific_name: "Orchidaceae",
    image_url: "https://invalid.example.com/orchid.jpg",
  },
];

describe("species API route", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("omits image_url when the link is inaccessible", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo, init?: RequestInit) => {
      if (typeof input === "string" && input.includes("api.openai.com")) {
        return new Response(
          JSON.stringify({
            choices: [
              { message: { content: JSON.stringify(mockResponse) } },
            ],
          }),
          { status: 200 }
        );
      }
      if (typeof input === "string" && input === mockResponse[0].image_url) {
        return new Response(null, { status: 200 });
      }
      if (
        typeof input === "string" &&
        input === mockResponse[1].image_url &&
        init?.method === "HEAD"
      ) {
        return new Response(null, { status: 404 });
      }
      if (
        typeof input === "string" &&
        input === mockResponse[1].image_url &&
        init?.method === "GET"
      ) {
        return new Response(null, { status: 404 });
      }
      throw new Error(`Unexpected fetch call: ${input}`);
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const { GET } = await import("./route");
    const req = new Request("http://localhost/api/species?q=rose");
    const res = await GET(req);
    const json = await res.json();
    expect(json.data).toEqual([
      mockResponse[0],
      {
        id: "2",
        common_name: "Orchid",
        scientific_name: "Orchidaceae",
        image_url: null,
      },
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      mockResponse[0].image_url,
      expect.objectContaining({ method: "HEAD" })
    );
  });

  it("evicts the oldest cache entry when the size limit is exceeded", async () => {
    vi.resetModules();
    const fetchMock = vi.fn(async (input: RequestInfo) => {
      if (typeof input === "string" && input.includes("api.openai.com")) {
        return new Response(
          JSON.stringify({
            choices: [{ message: { content: "[]" } }],
          }),
          { status: 200 }
        );
      }
      throw new Error(`Unexpected fetch call: ${input}`);
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const { GET } = await import("./route");

    const firstReq = new Request("http://localhost/api/species?q=0");
    await GET(firstReq);
    await GET(firstReq);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    for (let i = 1; i <= 100; i++) {
      const req = new Request(`http://localhost/api/species?q=${i}`);
      await GET(req);
    }

    const req = new Request("http://localhost/api/species?q=0");
    await GET(req);
    expect(fetchMock).toHaveBeenCalledTimes(102);
  });
});

export {};
