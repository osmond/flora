export async function POST(req: Request) {
  const {
    latitude,
    longitude,
    species,
    potSize,
    lightLevel,
    humidity,
  } = (await req.json().catch(() => ({}))) as {
    latitude?: number;
    longitude?: number;
    species?: string;
    potSize?: number;
    lightLevel?: string;
    humidity?: number;
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

  if (typeof humidity === "number") {
    weather.humidity = humidity;
  }

  let aiData: {
    waterEvery: string;
    fertEvery: string;
    fertFormula: string;
    rationale: string;
  } | null = null;

  if (process.env.OPENAI_API_KEY) {
    try {
      const prompt = `You are a helpful gardening assistant. Based on the following data, provide watering and fertilizing guidance in JSON format with keys waterEvery, fertEvery, fertFormula, and rationale. The rationale must mention the plant species.

Species: ${species ?? "unknown"}
Pot size: ${potSize ?? "unknown"}cm
Light level: ${lightLevel ?? "unknown"}
Humidity: ${weather.humidity ?? "unknown"}%
Climate zone: ${climateZone ?? "unknown"}
Current temperature: ${weather.temperature ?? "unknown"}°C`;

      const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        }),
      });
      const aiJson = await aiRes.json();
      const text = aiJson.choices?.[0]?.message?.content;
      if (text) {
        aiData = JSON.parse(text);
      }
    } catch (err) {
      console.error("Failed to fetch AI recommendations:", err);
    }
  }

  if (!aiData) {
    aiData = {
      waterEvery: "7 days",
      fertEvery: "Monthly",
      fertFormula: "10-10-10",
      rationale: `General care guidance for ${species ?? "this plant"}.`,
    };
  }

  const extra: string[] = [];
  if (typeof potSize === "number") extra.push(`pot size of ${potSize}cm`);
  if (lightLevel) extra.push(`${lightLevel.toLowerCase()} light`);
  if (typeof weather.humidity === "number")
    extra.push(`humidity around ${weather.humidity}%`);
  if (weather.temperature)
    extra.push(`current temperature of ${weather.temperature}°C`);
  if (climateZone) extra.push(`climate zone ${climateZone}`);
  const rationale = `${aiData.rationale} ${extra.join(", ")}.`.trim();

  return Response.json({
    waterEvery: aiData.waterEvery,
    fertEvery: aiData.fertEvery,
    fertFormula: aiData.fertFormula,
    rationale,
    weather,
    climateZone,
  });
}
