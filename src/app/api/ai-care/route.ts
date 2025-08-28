import { NextResponse } from "next/server";
import { getAiCareSuggestions, getAiCareAnswer } from "@/lib/aiCare";
import { SupabaseEnvError } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const plantId = searchParams.get("plantId");
  const question = searchParams.get("q");
  if (!plantId) {
    return NextResponse.json({ error: "Missing plantId" }, { status: 400 });
  }
  // Validate UUID to avoid Postgres cast errors
  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRe.test(plantId)) {
    return NextResponse.json({ error: "Invalid plantId (expected UUID)" }, { status: 400 });
  }
  try {
    if (question) {
      const answer = await getAiCareAnswer(plantId, question);
      return NextResponse.json({ answer });
    }
    const suggestions = await getAiCareSuggestions(plantId);
    return NextResponse.json({ suggestions });
  } catch (e) {
    if (e instanceof SupabaseEnvError) {
      return NextResponse.json({ error: e.message }, { status: 503 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export const runtime = "edge";
