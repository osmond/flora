import { NextResponse } from "next/server"

/**
 * Cache structure for species lookups. Keeps insertion order so that the
 * oldest entry can be evicted when the cache grows beyond the limit. The
 * cache is kept at module scope so it persists across invocations in the same
 * serverless instance.
 */
const cache = new Map<string, unknown>()
const cacheOrder: string[] = []
const CACHE_LIMIT = 100

/**
 * Fetches species suggestions from the OpenAI API. The API returns a JSON
 * string in the first choice's message content which we parse into an array of
 * `{ scientific, common? }` objects.
 */
async function fetchSpecies(q: string) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return []

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Return up to 10 plant species matching "${q}" as a JSON array of {scientific, common?}`,
        },
      ],
    }),
  })

  const json = await response.json()
  try {
    const content = json.choices?.[0]?.message?.content ?? "[]"
    return JSON.parse(content)
  } catch {
    return []
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = (url.searchParams.get("q") || "").trim().toLowerCase()
  if (!q) return NextResponse.json([])

  if (cache.has(q)) {
    return NextResponse.json(cache.get(q))
  }

  const results = await fetchSpecies(q)

  // Cache the results and maintain the eviction queue
  cache.set(q, results)
  cacheOrder.push(q)
  if (cacheOrder.length > CACHE_LIMIT) {
    const oldest = cacheOrder.shift()
    if (oldest) cache.delete(oldest)
  }

  return NextResponse.json(results)
}

