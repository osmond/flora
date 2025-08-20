export async function POST(req: Request) {
  const body = await req.json();
  return Response.json({
    waterEvery: "7 days",
    fertEvery: "Monthly",
    fertFormula: "10-10-10",
    rationale: "Based on your plant’s pot size, light, and humidity."
  });
}
