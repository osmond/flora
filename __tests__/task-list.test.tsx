import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TaskList from "@/components/TaskList";

(globalThis as unknown as { React: typeof React }).React = React;

vi.mock("canvas-confetti", () => ({
  __esModule: true,
  default: () => {},
}));

vi.mock("framer-motion", () => ({
  __esModule: true,
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  LayoutGroup: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    li: (props: any) => <li {...props} />,
    ul: (props: any) => <ul {...props} />,
    div: (props: any) => <div {...props} />,
  },
}));

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/ui/avatar", () => ({
  __esModule: true,
  Avatar: ({ children }: any) => <div>{children}</div>,
  AvatarFallback: ({ children }: any) => <div>{children}</div>,
}));

describe("TaskList empty state", () => {
  it("shows call to add a plant when no tasks", () => {
    render(<TaskList tasks={[]} />);
    expect(screen.getByText(/all caught up/i)).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /Add a Plant/i });
    expect(link).toHaveAttribute("href", "/plants/new");
  });
});

describe("TaskList task actions", () => {
  it("links to event logging from each task", () => {
    const tasks = [
      {
        id: "1",
        plantId: "abc",
        plantName: "Fern",
        type: "water" as const,
        due: new Date().toISOString(),
      },
    ];
    render(<TaskList tasks={tasks} />);
    const logLink = screen.getByRole("link", { name: /log/i });
    expect(logLink).toHaveAttribute("href", "/plants/abc#log-event");
  });
});
