// src/app/api/species/route.ts
import { NextResponse } from "next/server";

// Simple in-memory cache to avoid hammering third-party APIs
const CACHE_TTL_MS = 1000 * 60 * 5; // 5 minutes
const cache = new Map<string, { data: unknown; expires: number }>();

async function fetchPerenual(q: string) {
  const res = await fetch(
    `https://perenual.com/api/species-list?key=${process.env.PERENUAL_API_KEY}&q=${encodeURIComponent(q)}`
  );
  if (!res.ok) throw new Error(`Perenual API error: ${res.status}`);
  const body = await res.json();

  type PerenualPlant = {
    id: number;
    common_name: string;
    scientific_name: string;
    default_image?: { thumbnail?: string };
  };

  return (
    body?.data?.map((p: PerenualPlant) => ({
      id: `perenual-${p.id}`,
      common_name: p.common_name,
      scientific_name: p.scientific_name,
      image_url: p.default_image?.thumbnail,
    })) ?? []
  );
}

async function fetchTrefle(q: string) {
  const res = await fetch(
    `https://trefle.io/api/v1/plants/search?token=${process.env.TREFLE_API_KEY}&q=${encodeURIComponent(q)}`
  );
  if (!res.ok) throw new Error(`Trefle API error: ${res.status}`);
  const body = await res.json();

  type TreflePlant = {
    id: number;
    common_name: string;
    scientific_name: string;
    image_url?: string;
  };

  return (
    body?.data?.map((p: TreflePlant) => ({
      id: `trefle-${p.id}`,
      common_name: p.common_name,
      scientific_name: p.scientific_name,
      image_url: p.image_url,
    })) ?? []
  );
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
    let results = [];
    try {
      results = await fetchPerenual(q);
    } catch (err) {
      console.warn("Perenual failed, falling back to Trefle:", err);
      results = await fetchTrefle(q);
    }

    cache.set(q, { data: results, expires: Date.now() + CACHE_TTL_MS });

    return NextResponse.json({ data: results });
  } catch (err: unknown) {
    console.error("Species API error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
