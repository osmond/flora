import { test } from "node:test";
import { strict as assert } from "node:assert";

process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.com";
process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";

test("plantSchema validates correct payload", async () => {
  const { plantSchema } = await import("./route");
  const result = plantSchema.safeParse({
    name: "Fern",
    species: "Pteridophyta",
    latitude: 40,
    longitude: -70,
    humidity: 50,
  });
  assert.equal(result.success, true);
});

test("POST returns 400 for invalid latitude", async () => {
  const { POST } = await import("./route");
  const form = new FormData();
  form.set("name", "Fern");
  form.set("species", "Pteridophyta");
  form.set("latitude", "200");
  const req = new Request("http://localhost", { method: "POST", body: form });
  const res = await POST(req);
  assert.equal(res.status, 400);
});

test("plantSchema rejects invalid latitude", async () => {
  const { plantSchema } = await import("./route");
  const result = plantSchema.safeParse({
    name: "Fern",
    species: "Pteridophyta",
    latitude: 200,
  });
  assert.equal(result.success, false);
});
