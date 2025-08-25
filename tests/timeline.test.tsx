import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Timeline } from "@/components/plant/Timeline";

(globalThis as unknown as { React: typeof React }).React = React;

describe("Timeline", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });
  it("shows error message when fetch fails", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({ ok: false, json: async () => ({}) })));
    render(<Timeline plantId={1} />);
    const msg = await screen.findByText("Failed to load events");
    expect(msg).toBeDefined();
  });
});

