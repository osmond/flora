import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { renderToString } from "react-dom/server";

import { render, screen, fireEvent, act } from "@testing-library/react";
vi.mock("@/lib/supabase/client", () => ({
  supabaseClient: {
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
    },
  },
}));


import AddNoteForm from "../src/components/AddNoteForm";

(globalThis as unknown as { React: typeof React }).React = React;

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: () => undefined }),
}));

describe("AddNoteForm", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders textarea and button", () => {
    const html = renderToString(
      <AddNoteForm plantId="1" onAdd={() => undefined} onReplace={() => undefined} />,
    );
    expect(html).toContain("textarea");
    expect(html).toContain("Add Note");
  });

  it("disables submit while posting", async () => {
    let resolveFetch: (value: unknown) => void = () => undefined;
    vi.stubGlobal(
      "fetch",
      vi.fn(
        () =>
          new Promise((res) => {
            resolveFetch = res;
          }),
      ),
    );
    render(<AddNoteForm plantId="1" onAdd={() => undefined} onReplace={() => undefined} />);
    const textarea = screen.getByPlaceholderText("Write a note...");
    fireEvent.change(textarea, { target: { value: "hello" } });
    const button = screen.getByRole("button", { name: /add note/i });
    await act(async () => {
      fireEvent.click(button);
    });
    expect(button).toBeDisabled();

    await act(async () => {
      fireEvent.click(button);
    });
    await vi.waitFor(() =>
      expect((globalThis.fetch as any)).toHaveBeenCalledTimes(1),
    );

    resolveFetch({ ok: true, json: () => Promise.resolve({}) });
  });
});
