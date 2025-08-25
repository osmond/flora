import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { potSize, potUnit, species } = await req.json();
  const size = potUnit === 'in' ? Math.round(potSize / 2.54) : potSize;
  const rationale = `${size}${potUnit}`;
  const confidence = 'medium';
  return NextResponse.json({ rationale, confidence });
}
