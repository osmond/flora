import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import AddPlantForm from "@/components/plant/AddPlantForm";

(globalThis as unknown as { React: typeof React }).React = React;

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("@/components/plant/SpeciesAutosuggest", () => ({
  __esModule: true,
  default: ({
    value = "",
    onSelect,
    onInputChange,
  }: {
    value?: string;
    onSelect: (s: string, c?: string) => void;
    onInputChange?: (v: string) => void;
  }) => (
    <input
      aria-label="species"
      value={value}
      onChange={(e) => onInputChange?.(e.target.value)}
    />
  ),
}));

const originalFetch = global.fetch;

beforeEach(() => {
  push.mockReset();
  // stub fetch to avoid network calls from RoomSelect
  global.fetch = vi.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
  ) as unknown as typeof fetch;
});

afterEach(() => {
  global.fetch = originalFetch;
});

describe("AddPlantForm optional details", () => {
  it("shows optional fields when expanded", () => {
    render(<AddPlantForm />);
    const toggle = screen.getByRole("button", { name: /add details/i });
    fireEvent.click(toggle);
    expect(screen.getByLabelText(/room/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/pot/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/light/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/photo/i)).toBeInTheDocument();
  });
});

describe("AddPlantForm validation", () => {
  it("shows errors when required fields are missing", async () => {
    render(<AddPlantForm />);
    fireEvent.click(screen.getByRole("button", { name: /create plant/i }));
    expect(
      await screen.findByText(/please enter a nickname/i),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/please enter a species/i),
    ).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

describe("AddPlantForm submission", () => {
  it("posts typed species to both fields and redirects to detail page", async () => {
    global.fetch = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      if (typeof input === "string" && input.startsWith("/api/ai-care/preview")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ preview: "test" }) });
      }
      if (typeof input === "string" && input === "/api/plants" && init?.method === "POST") {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ plant: { id: 42 } }) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    }) as unknown as typeof fetch;

    render(<AddPlantForm />);

    fireEvent.change(screen.getByLabelText(/nickname/i), {
      target: { value: "Kay" },
    });
    fireEvent.change(screen.getByLabelText(/species/i), {
      target: { value: "Pothos" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create plant/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/plants",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining('"speciesScientific":"Pothos"'),
        })
      );
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/plants",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining('"speciesCommon":"Pothos"'),
        })
      );
      expect(push).toHaveBeenCalledWith("/plants/42");
    });
  });
});
