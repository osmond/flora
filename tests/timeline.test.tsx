import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
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
  it("shows retry button when fetch fails and reloads after retry", async () => {
    const event = {
      id: 1,
      type: "watered",
      note: null,
      created_at: new Date().toISOString(),
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, json: async () => ({}) })
      .mockResolvedValueOnce({ ok: true, json: async () => [event] });
    vi.stubGlobal("fetch", fetchMock);
    render(<Timeline plantId={1} />);
    const retry = await screen.findByRole("button", { name: /retry/i });
    fireEvent.click(retry);
    await screen.findByText(/watered/i);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

