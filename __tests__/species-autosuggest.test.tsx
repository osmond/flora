import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import SpeciesAutosuggest from "@/components/plant/SpeciesAutosuggest";

(globalThis as unknown as { React: typeof React }).React = React;

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(globalThis as any).ResizeObserver = ResizeObserver;

vi.mock("@/lib/use-debounce", () => ({
  useDebounce: (v: string) => v,
}));

afterEach(() => {
  vi.restoreAllMocks();
});

describe("SpeciesAutosuggest", () => {
  it("displays suggestions from array response", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => [{ scientific: "Ficus lyrata", common: "Fiddle" }],
    } as any);

    render(<SpeciesAutosuggest onSelect={() => {}} />);
    const input = screen.getByPlaceholderText(/search species/i);
    fireEvent.change(input, { target: { value: "fi" } });

    expect(await screen.findByText("Fiddle")).toBeInTheDocument();
  });

  it("displays suggestions from results response", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [{ scientific: "Monstera deliciosa" }] }),
    } as any);

    render(<SpeciesAutosuggest onSelect={() => {}} />);
    const input = screen.getByPlaceholderText(/search species/i);
    fireEvent.change(input, { target: { value: "mon" } });

    expect(await screen.findByText("Monstera deliciosa")).toBeInTheDocument();
  });
});

