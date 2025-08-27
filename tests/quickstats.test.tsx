import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import QuickStats from "@/components/plant/QuickStats";

(globalThis as unknown as { React: typeof React }).React = React;

vi.mock("@/lib/auth", () => ({
  getCurrentUserId: () => Promise.resolve("user-1"),
}));

const lastDate = new Date("2025-01-01T00:00:00Z");

vi.mock("@/lib/supabaseAdmin", () => ({
  supabaseAdmin: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            eq: () => ({
              order: () => ({
                limit: () => ({
                  data: [{ created_at: lastDate.toISOString() }],
                }),
              }),
            }),
          }),
        }),
      }),
    }),
  }),
}));

describe("QuickStats", () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-03T00:00:00Z"));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("renders water stats", async () => {
    const element = await QuickStats({ plant: { id: "1", waterEvery: "5" } });
    render(element);
    expect(screen.getByText(/last watered/i)).toBeInTheDocument();
    expect(screen.getByText(/2 days ago/i)).toBeInTheDocument();
    expect(screen.getByText(/in 3 days/i)).toBeInTheDocument();
    expect(screen.getByText(/water every/i)).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});
