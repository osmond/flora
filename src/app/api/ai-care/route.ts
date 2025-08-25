import { z } from "zod";
import { NextResponse } from "next/server";

const bodySchema = z.object({
  potSize: z.number(),
  potUnit: z.enum(["in", "cm"]),
  species: z.string().optional(),
});

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const { potSize, potUnit } = parsed.data;
  const size = potUnit === "in" ? Math.round(potSize / 2.54) : potSize;
  const rationale = `${size}${potUnit}`;
  const confidence = "medium";
  return NextResponse.json({ rationale, confidence });
}
