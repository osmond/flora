import React from "react";
import { renderToString } from "react-dom/server";
import { describe, it, expect, vi, type Mock } from "vitest";

(globalThis as unknown as { React: typeof React }).React = React;

vi.mock("@/lib/aiCare", () => ({
  getAiCareSuggestions: vi.fn(),
}));

describe("CareCoach", () => {
  it("shows error message when suggestions fail", async () => {
    const { getAiCareSuggestions } = await import("@/lib/aiCare");
    (getAiCareSuggestions as Mock).mockRejectedValue(new Error("fail"));
    const CareCoach = (await import("../src/components/plant/CareCoach")).default;
    const element = await CareCoach({ plant: { id: "1" } });
    const html = renderToString(element);
    expect(html).toContain("Failed to load suggestions");
  });
});

