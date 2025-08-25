import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CareTimeline from "@/components/CareTimeline";

(globalThis as unknown as { React: typeof React }).React = React;

describe("CareTimeline", () => {
  it("shows error message when error is true", () => {
    render(<CareTimeline events={[]} error />);
    expect(screen.getByText("Failed to load timeline.")).toBeDefined();
  });
});
