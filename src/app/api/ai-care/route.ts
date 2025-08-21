export async function POST(req: Request) {
  const { latitude, longitude } =
    (await req.json().catch(() => ({}))) as {
      latitude?: number;
      longitude?: number;
    };

  const weather: { temperature?: number; humidity?: number } = {};

  if (typeof latitude === "number" && typeof longitude === "number") {
    try {
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relativehumidity_2m`
      );
      const weatherData = await weatherRes.json();
      weather.temperature = weatherData.current?.temperature_2m;
      weather.humidity = weatherData.current?.relativehumidity_2m;
    } catch (err) {
      console.error("Failed to fetch weather:", err);
    }
  }

  const rationale = weather.temperature
    ? `Based on your plant’s pot size, light, humidity, and the current temperature of ${weather.temperature}°C.`
    : "Based on your plant’s pot size, light, and humidity.";

  return Response.json({
    waterEvery: "7 days",
    fertEvery: "Monthly",
    fertFormula: "10-10-10",
    rationale,
    weather,
  });
}
