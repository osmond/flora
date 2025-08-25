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

describe("TaskList empty state", () => {
  it("shows call to add a plant when no tasks", () => {
    render(<TaskList tasks={[]} />);
    expect(screen.getByText(/No plants yet/i)).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /Add a Plant/i });
    expect(link).toHaveAttribute("href", "/plants/new");
  });
});
