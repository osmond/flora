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
    (global as any).fetch = fetchMock;

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
    expect(fetchMock).toHaveBeenCalledWith(mockResponse[0].image_url, { method: "HEAD" });
  });
});

export {};
