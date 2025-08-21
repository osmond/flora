// src/app/api/species/route.ts
import { NextResponse } from "next/server";

// Simple in-memory cache to avoid hammering third-party APIs
const CACHE_TTL_MS = 1000 * 60 * 5; // 5 minutes
const cache = new Map<string, { data: unknown; expires: number }>();

type Species = {
  id: string;
  common_name: string;
  scientific_name: string;
  image_url?: string | null;
};

async function fetchOpenAISpecies(q: string): Promise<Species[]> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("Missing OPENAI_API_KEY");
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful botany assistant.",
        },
        {
          role: "user",
          content:
            `List up to 5 plant species that match the query "${q}". ` +
            "Return a JSON array where each item has id, common_name, scientific_name, and image_url.",
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`OpenAI API error: ${res.status}`);
  const body = await res.json();
  const content = body?.choices?.[0]?.message?.content;
  if (typeof content !== "string") return [];

  // The OpenAI responses are not always plain JSON. They might include
  // explanations or wrap the JSON in markdown code fences. Attempt to
  // extract the first JSON block and parse it. If parsing fails, return an
  // empty array rather than throwing so the API can respond gracefully.
  let jsonText = content.trim();
  const match = jsonText.match(/```(?:json)?\n([\s\S]*?)```/i);
  if (match) {
    jsonText = match[1];
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    console.warn("Invalid JSON from OpenAI", jsonText);
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  return (parsed as unknown[]).map((p, idx) => {
    const obj = p as Record<string, unknown>;
    return {
      id: typeof obj.id === "string" ? obj.id : `openai-${idx}`,
      common_name: String(obj.common_name ?? ""),
      scientific_name: String(obj.scientific_name ?? ""),
      image_url: typeof obj.image_url === "string" ? obj.image_url : null,
    };
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  if (!q) return NextResponse.json({ data: [] });

  // Return cached results when available and fresh
  const cached = cache.get(q);
  if (cached) {
    if (cached.expires > Date.now()) {
      return NextResponse.json({ data: cached.data });
    }
    cache.delete(q);
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      console.warn(
        "Species search requested but no OPENAI_API_KEY configured"
      );
      return NextResponse.json({ data: [] });
    }

    const results = await fetchOpenAISpecies(q);
    cache.set(q, { data: results, expires: Date.now() + CACHE_TTL_MS });

    return NextResponse.json({ data: results });
  } catch (err: unknown) {
    console.error("Species API error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
