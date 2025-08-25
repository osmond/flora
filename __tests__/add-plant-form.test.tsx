import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import AddPlantForm from "@/components/plant/AddPlantForm";

(globalThis as unknown as { React: typeof React }).React = React;

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

beforeEach(() => {
  // stub fetch to avoid network calls from RoomSelect
  global.fetch = vi.fn(() =>
    Promise.resolve({ json: () => Promise.resolve([]) })
  ) as unknown as typeof fetch;
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
