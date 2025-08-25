import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import WaterPlantButton from "../src/components/plant/WaterPlantButton";

(globalThis as unknown as { React: typeof React }).React = React;

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: () => undefined }),
}));

describe("WaterPlantButton", () => {
  it("renders button text", () => {
    const html = renderToString(<WaterPlantButton plantId="1" />);
    expect(html).toContain("Mark as watered");
  });
});

