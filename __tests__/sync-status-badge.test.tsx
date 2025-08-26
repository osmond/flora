import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import SyncStatusBadge from "@/components/SyncStatusBadge";
import { queueEvent, QUEUE_KEY } from "@/lib/offlineQueue";

(globalThis as unknown as { React: typeof React }).React = React;

describe("SyncStatusBadge", () => {
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(window.navigator, "onLine", {
      value: true,
      configurable: true,
    });
  });

  it("shows Synced when queue is empty", () => {
    render(<SyncStatusBadge />);
    expect(screen.getByText(/synced/i)).toBeInTheDocument();
  });

  it("shows Pending when there are queued events", () => {
    Object.defineProperty(window.navigator, "onLine", {
      value: false,
      configurable: true,
    });
    queueEvent({ plant_id: "1", type: "note", note: "hi" });
    render(<SyncStatusBadge />);
    expect(screen.getByText(/pending/i)).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]")).toHaveLength(1);
  });
});
