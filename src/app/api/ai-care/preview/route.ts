import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const species = searchParams.get("species");
  if (!species) {
    return NextResponse.json({ error: "Missing species" }, { status: 400 });
  }
  const preview = `Basic care for ${species}: keep soil lightly moist and provide bright indirect light.`;
  return NextResponse.json({ preview });
}

export const runtime = "edge";
