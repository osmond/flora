import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import AddPlantForm from "@/components/plant/AddPlantForm";

(globalThis as unknown as { React: typeof React }).React = React;

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  notFound: vi.fn(),
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
  localStorage.clear();
});

afterEach(() => {
  global.fetch = originalFetch;
});

describe("AddPlantForm step navigation", () => {
  it("shows detail fields after navigating", async () => {
    render(<AddPlantForm />);
    expect(screen.queryByLabelText(/room/i)).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/nickname/i), {
      target: { value: "Kay" },
    });
    fireEvent.change(screen.getByLabelText(/species/i), {
      target: { value: "Pothos" },
    });
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(await screen.findByLabelText(/room/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/pot/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/light/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/photo/i)).toBeInTheDocument();
  });
});

describe("AddPlantForm validation", () => {
  it("shows errors when required fields are missing", async () => {
    render(<AddPlantForm />);
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
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

    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    await screen.findByLabelText(/room/i); // wait for step 2
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    await screen.findByRole("button", { name: /create plant/i });
    fireEvent.click(screen.getByRole("button", { name: /create plant/i }));

    await waitFor(() => {
      const plantCall = (global.fetch as any).mock.calls.find(
        ([input, init]: any[]) =>
          input === "/api/plants" && init?.method === "POST",
      );
      expect(plantCall).toBeTruthy();
      const body = plantCall[1].body as FormData;
      expect(body.get("speciesScientific")).toBe("Pothos");
      expect(body.get("speciesCommon")).toBe("Pothos");
      expect(push).toHaveBeenCalledWith("/plants/42");
    });
  });
});

describe("AddPlantForm localStorage draft", () => {
  it("saves field values to localStorage", async () => {
    render(<AddPlantForm />);
    fireEvent.change(screen.getByLabelText(/nickname/i), {
      target: { value: "Kay" },
    });
    fireEvent.change(screen.getByLabelText(/species/i), {
      target: { value: "Pothos" },
    });
    await waitFor(() => {
      const stored = localStorage.getItem("addPlantForm");
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed.nickname).toBe("Kay");
      expect(parsed.species).toBe("Pothos");
    });
  });

  it("initializes fields from saved draft", () => {
    localStorage.setItem(
      "addPlantForm",
      JSON.stringify({ nickname: "Saved", species: "Rose" }),
    );
    render(<AddPlantForm />);
    expect(
      (screen.getByLabelText(/nickname/i) as HTMLInputElement).value,
    ).toBe("Saved");
    expect(
      (screen.getByLabelText(/species/i) as HTMLInputElement).value,
    ).toBe("Rose");
  });

  it("clears saved draft after submission", async () => {
    localStorage.setItem(
      "addPlantForm",
      JSON.stringify({ nickname: "Kay", species: "Pothos" }),
    );
    global.fetch = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      if (typeof input === "string" && input.startsWith("/api/ai-care/preview")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ preview: "test" }) });
      }
      if (typeof input === "string" && input === "/api/plants" && init?.method === "POST") {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ plant: { id: 1 } }) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    }) as unknown as typeof fetch;

    render(<AddPlantForm />);
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    await screen.findByLabelText(/room/i);
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    await screen.findByRole("button", { name: /create plant/i });
    fireEvent.click(screen.getByRole("button", { name: /create plant/i }));
    await waitFor(() => expect(push).toHaveBeenCalled());
    expect(localStorage.getItem("addPlantForm")).toBeNull();
  });

  it("clears saved draft on manual reset", async () => {
    render(<AddPlantForm />);
    fireEvent.change(screen.getByLabelText(/nickname/i), {
      target: { value: "Kay" },
    });
    await waitFor(() =>
      expect(localStorage.getItem("addPlantForm")).not.toBeNull(),
    );
    fireEvent.click(screen.getByRole("button", { name: /reset/i }));
    await waitFor(() =>
      expect(localStorage.getItem("addPlantForm")).toBeNull(),
    );
  });
});
