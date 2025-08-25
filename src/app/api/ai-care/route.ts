import { NextResponse } from "next/server";
import { getAiCareSuggestions } from "@/lib/aiCare";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const plantId = searchParams.get("plantId");
  if (!plantId) {
    return NextResponse.json({ error: "Missing plantId" }, { status: 400 });
  }
  try {
    const suggestions = await getAiCareSuggestions(plantId);
    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export const runtime = "edge";
