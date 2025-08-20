import { NextResponse } from "next/server";

const UA = "flora-app/0.1 (+local dev)";

async function trefleSearch(q: string, token: string) {
  const url = `https://trefle.io/api/v1/plants/search?q=${encodeURIComponent(q)}&token=${token}`;
  const res = await fetch(url, {
    // avoid caching during dev
    cache: "no-store",
    headers: {
      "User-Agent": UA,
      "Accept": "application/json",
    },
  });
  const text = await res.text();
  let json: any = null;
  try { json = JSON.parse(text); } catch {}
  return { ok: res.ok, status: res.status, text, json };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    if (!q || q.trim().length < 2) {
      return NextResponse.json([]);
    }

    const token = process.env.TREFLE_API_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "Missing TREFLE_API_TOKEN on server" }, { status: 500 });
    }

    // 1st attempt
    let r = await trefleSearch(q, token);

    // simple retry once on 5xx
    if (!r.ok && r.status >= 500) {
      r = await trefleSearch(q, token);
    }

    if (!r.ok) {
      // bubble up what Trefle said so we can see it in Network tab
      return NextResponse.json(
        { error: "Trefle request failed", status: r.status, body: r.json ?? r.text },
        { status: 502 }
      );
    }

    const items = Array.isArray(r.json?.data)
      ? r.json.data.map((p: any) => ({
          common_name: p?.common_name ?? null,
          scientific_name: p?.scientific_name ?? null,
          image_url: p?.image_url ?? null,
        }))
      : [];

    return NextResponse.json(items);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unknown server error" },
      { status: 500 }
    );
  }
}
