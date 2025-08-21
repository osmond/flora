export async function POST() {
  return Response.json({
    waterEvery: "7 days",
    fertEvery: "Monthly",
    fertFormula: "10-10-10",
    rationale: "Based on your plant’s pot size, light, and humidity.",
  });
}
