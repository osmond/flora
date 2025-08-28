import { NextResponse } from "next/server";
import { supabaseServer, SupabaseEnvError } from "@/lib/supabase/server";

type Suggestion = { scientific: string; common?: string };

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  if (!q) return NextResponse.json([]);
  try {
    const supabase = supabaseServer();
    // 1) Try cache in species table
    const { data: cached } = await supabase
      .from("species")
      .select("scientific_name, common_name")
      .ilike("common_name", `%${q}%`)
      .limit(10);
    if (cached && cached.length) {
      return NextResponse.json(
        cached.map((r: any) => ({ scientific: r.scientific_name, common: r.common_name }))
      );
    }

    // 2) If OpenAI key is present, query model for suggestions and upsert
    if (process.env.OPENAI_API_KEY) {
      const body = {
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "Return JSON with an array 'results' of plant species: {scientific, common}." },
          { role: "user", content: `Suggest up to 5 species for query: ${q}` },
        ],
      } as const;
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          ...(process.env.OPENAI_PROJECT ? { "OpenAI-Project": process.env.OPENAI_PROJECT as string } : {}),
          ...(process.env.OPENAI_ORG ? { "OpenAI-Organization": process.env.OPENAI_ORG as string } : {}),
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const json = await res.json();
        const content = json?.choices?.[0]?.message?.content;
        const parsed = content ? JSON.parse(content) : null;
        const results: Suggestion[] = Array.isArray(parsed?.results) ? parsed.results : [];
        if (results.length) {
          // Best-effort upsert
          const rows = results.map((r) => ({
            scientific_name: r.scientific,
            common_name: r.common ?? null,
          }));
          await supabase.from("species").upsert(rows, { onConflict: "scientific_name" });
          return NextResponse.json(results);
        }
      }
    }
    // 3) Fallback: empty
    return NextResponse.json([]);
  } catch (e) {
    if (e instanceof SupabaseEnvError) {
      return NextResponse.json({ error: e.message }, { status: 503 });
    }
    return NextResponse.json([], { status: 200 });
  }
}

export const runtime = "nodejs";

