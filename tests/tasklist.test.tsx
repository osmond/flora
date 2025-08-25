import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import TaskList from "@/components/TaskList";

(globalThis as unknown as { React: typeof React }).React = React;

describe("TaskList snooze menu", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        })
      )
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends snooze request with chosen days", async () => {
    const tasks = [
      {
        id: "1",
        plantId: "1",
        plantName: "Test Plant",
        type: "water" as const,
        due: new Date().toISOString(),
      },
    ];
    render(<TaskList tasks={tasks} />);
    const snoozeBtn = screen.getByText("Snooze");
    fireEvent.keyDown(snoozeBtn, { key: 'Enter' });
    const option = await screen.findByText("Snooze 3d");
    fireEvent.click(option);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    const body = JSON.parse((global.fetch as any).mock.calls[0][1].body);
    expect(body).toEqual({ action: "snooze", days: 3 });
  });
});

export {};
