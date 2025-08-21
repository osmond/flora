import { describe, it, expect } from "vitest";

process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.com";
process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
process.env.CLOUDINARY_CLOUD_NAME = "cloud";
process.env.CLOUDINARY_API_KEY = "cloud-key";
process.env.CLOUDINARY_API_SECRET = "cloud-secret";

describe("plants API route", () => {
  it("plantSchema validates correct payload", async () => {
    const { plantSchema } = await import("./route");
    const result = plantSchema.safeParse({
      name: "Fern",
      species: "Pteridophyta",
      latitude: 40,
      longitude: -70,
      humidity: 50,
    });
    expect(result.success).toBe(true);
  });

  it("POST returns 400 for invalid latitude", async () => {
    const { POST } = await import("./route");
    const form = new FormData();
    form.set("name", "Fern");
    form.set("species", "Pteridophyta");
    form.set("latitude", "200");
    const req = new Request("http://localhost", { method: "POST", body: form });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("plantSchema rejects invalid latitude", async () => {
    const { plantSchema } = await import("./route");
    const result = plantSchema.safeParse({
      name: "Fern",
      species: "Pteridophyta",
      latitude: 200,
    });
    expect(result.success).toBe(false);
  });
});

export {};
