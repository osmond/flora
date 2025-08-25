import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import TaskList from "@/components/TaskList";

(globalThis as unknown as { React: typeof React }).React = React;

vi.mock("canvas-confetti", () => ({
  __esModule: true,
  default: () => {},
}));

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
    vi.stubGlobal(
      "AudioContext",
      vi.fn(() => ({
        createOscillator: () => ({
          type: "sine",
          frequency: { setValueAtTime: () => {} },
          connect: () => {},
          start: () => {},
          stop: () => {},
          onended: null,
        }),
        createGain: () => ({
          gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
          connect: () => {},
        }),
        destination: {},
        currentTime: 0,
        close: () => {},
      }))
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

  it("prevents duplicate completion requests", () => {
    let resolveFetch: (value: unknown) => void = () => undefined;
    const fetchMock = vi.fn(
      () =>
        new Promise((res) => {
          resolveFetch = res;
        }),
    );
    vi.stubGlobal("fetch", fetchMock);
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
    const doneBtn = screen.getByText("Done");
    fireEvent.click(doneBtn);
    expect(doneBtn).toBeDisabled();
    fireEvent.click(doneBtn);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    resolveFetch({ ok: true, json: () => Promise.resolve({}) });
  });
});

export {};
