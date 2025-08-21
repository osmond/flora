export async function POST(req: Request) {
  const { latitude, longitude } =
    (await req.json().catch(() => ({}))) as {
      latitude?: number;
      longitude?: number;
    };

  const weather: { temperature?: number; humidity?: number } = {};
  let climateZone: string | undefined;

  if (typeof latitude === "number" && typeof longitude === "number") {
    try {
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relativehumidity_2m`
      );
      const weatherData = await weatherRes.json();
      weather.temperature = weatherData.current?.temperature_2m;
      weather.humidity = weatherData.current?.relativehumidity_2m;

      const climateRes = await fetch(
        `https://climate-api.open-meteo.com/v1/climate?latitude=${latitude}&longitude=${longitude}&start_date=2020-01-01&end_date=2020-12-31&daily=usda_hardiness_zone`
      );
      const climateData = await climateRes.json();
      const zone = climateData.daily?.usda_hardiness_zone?.[0];
      if (zone !== undefined) climateZone = zone.toString();
    } catch (err) {
      console.error("Failed to fetch weather or climate zone:", err);
    }
  }

  const rationaleParts = [
    "Based on your plant’s pot size, light, and humidity",
  ];
  if (weather.temperature)
    rationaleParts.push(
      `the current temperature of ${weather.temperature}°C`
    );
  if (climateZone)
    rationaleParts.push(`your climate zone ${climateZone}`);
  const rationale = `${rationaleParts.join(", ")}.`;

  return Response.json({
    waterEvery: "7 days",
    fertEvery: "Monthly",
    fertFormula: "10-10-10",
    rationale,
    weather,
    climateZone,
  });
}
