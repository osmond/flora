import { describe, it, expect, vi, beforeEach } from "vitest";

process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.com";
process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";

vi.mock("@/lib/auth", () => ({
  getCurrentUserId: () => "user-123",
}));

let destroyedId: string | null = null;
vi.mock("@/lib/cloudinary", () => ({
  default: {
    uploader: {
      upload_stream: (
        _opts: unknown,
        cb: (
          err: unknown,
          res?: { secure_url: string; public_id: string },
        ) => void,
      ) => ({
        end: () =>
          cb(null, {
            secure_url: "https://example.com/uploaded.jpg",
            public_id: "cloud123",
          }),
      }),
      destroy: (id: string) => {
        destroyedId = id;
        return Promise.resolve({ result: "ok" });
      },
    },
  },
}));

let updatedImageUrl: string | null = null;
let eventDeleted = false;
let insertedValues: Record<string, unknown> | null = null;
const eventRecord = {
  id: "1",
  plant_id: "4aa97bee-71f1-428e-843b-4c3c77493994",
  image_url: "https://example.com/uploaded.jpg",
  public_id: "cloud123",
  user_id: "user-123",
};
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: (table: string) => {
      if (table === "plants") {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({
                single: () =>
                  Promise.resolve({
                    data: {
                      id: "4aa97bee-71f1-428e-843b-4c3c77493994",
                      image_url: null,
                    },
                    error: null,
                  }),
              }),
            }),
          }),
          update: (values: { image_url: string }) => {
            updatedImageUrl = values.image_url;
            return {
              eq: () => ({
                eq: () => ({
                  is: () => Promise.resolve({ error: null }),
                }),
              }),
            };
          },
        };
      }
      if (table === "events") {
        return {
          insert: (vals: Record<string, unknown>) => {
            insertedValues = vals;
            return {
              select: () =>
                Promise.resolve({
                  data: [eventRecord],
                  error: null,
                }),
            };
          },
          select: () => ({
            eq: () => ({
              eq: () => ({
                single: () =>
                  Promise.resolve({ data: eventRecord, error: null }),
              }),
            }),
          }),
          delete: () => ({
            eq: () => ({
              eq: (_col: string, id: string) => {
                eventDeleted = id === "1";
                return Promise.resolve({ error: null });
              },
            }),
          }),
        };
      }

      return {} as unknown as Record<string, never>;
    },
  }),
}));

describe("POST /api/events", () => {
  beforeEach(() => {
    insertedValues = null;
  });

  it("returns 200 for valid submission", async () => {
    const { POST } = await import("../src/app/api/events/route");
    const req = new Request("http://localhost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plant_id: "4aa97bee-71f1-428e-843b-4c3c77493994",
        type: "note",
        note: "hello",
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("returns 400 when required fields are missing", async () => {
    const { POST } = await import("../src/app/api/events/route");
    const req = new Request("http://localhost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plant_id: "1" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid field types", async () => {
    const { POST } = await import("../src/app/api/events/route");
    const req = new Request("http://localhost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plant_id: "not-a-uuid", type: "note" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("logs a water event", async () => {
    const { POST } = await import("../src/app/api/events/route");
    const req = new Request("http://localhost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plant_id: "4aa97bee-71f1-428e-843b-4c3c77493994",
        type: "water",
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(insertedValues).toMatchObject({
      type: "water",
      user_id: "user-123",
    });
  });

  it("updates plant image_url when uploading a photo", async () => {
    const { POST } = await import("../src/app/api/events/route");
    const form = new FormData();
    form.set("plant_id", "4aa97bee-71f1-428e-843b-4c3c77493994");
    form.set("type", "photo");
    const file = new File(["dummy"], "test.jpg", { type: "image/jpeg" });
    form.set("photo", file);
    const req = new Request("http://localhost", { method: "POST", body: form });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(updatedImageUrl).toBe("https://example.com/uploaded.jpg");
  });
});

describe("DELETE /api/events/[id]", () => {
  it("deletes the event and associated image", async () => {
    const { DELETE } = await import("../src/app/api/events/[id]/route");
    const res = await DELETE(
      new Request("http://localhost", { method: "DELETE" }),
      {
        params: { id: "1" },
      },
    );
    expect(res.status).toBe(200);
    expect(eventDeleted).toBe(true);
    expect(destroyedId).toBe("cloud123");
  });
});
