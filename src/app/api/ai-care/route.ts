import { NextResponse } from "next/server";
import { getAiCareSuggestions, getAiCareAnswer } from "@/lib/aiCare";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const plantId = searchParams.get("plantId");
  const question = searchParams.get("q");
  if (!plantId) {
    return NextResponse.json({ error: "Missing plantId" }, { status: 400 });
  }
  try {
    if (question) {
      const answer = await getAiCareAnswer(plantId, question);
      return NextResponse.json({ answer });
    }
    const suggestions = await getAiCareSuggestions(plantId);
    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export const runtime = "edge";
