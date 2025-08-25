import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import AddNoteForm from "../src/components/AddNoteForm";

(globalThis as unknown as { React: typeof React }).React = React;

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: () => undefined }),
}));

describe("AddNoteForm", () => {
  it("renders textarea and button", () => {
    const html = renderToString(
      <AddNoteForm plantId="1" onAdd={() => undefined} onReplace={() => undefined} />,
    );
    expect(html).toContain("textarea");
    expect(html).toContain("Add Note");
  });
});
