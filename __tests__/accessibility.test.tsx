import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import fs from "fs";
import path from "path";

(globalThis as unknown as { React: typeof React }).React = React;
(globalThis as unknown as { ResizeObserver: typeof ResizeObserver }).ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
(globalThis as any).Element.prototype.scrollIntoView = () => {};

describe("keyboard navigation", () => {
  it("works for Tabs", async () => {
    render(
      <Tabs defaultValue="one">
        <TabsList>
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>
        <TabsContent value="one">One</TabsContent>
        <TabsContent value="two">Two</TabsContent>
      </Tabs>
    );
    const first = screen.getByRole("tab", { name: /one/i });
    await userEvent.tab();
    expect(first).toHaveFocus();
  });

  it("works for DropdownMenu", async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    const trigger = screen.getByRole("button", { name: /menu/i });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    const first = await screen.findByRole("menuitem", { name: /item 1/i });
    expect(first).toHaveFocus();
  });

  it("works for Command", async () => {
    render(
      <Command>
        <CommandInput placeholder="Search" />
        <CommandList>
          <CommandItem>First</CommandItem>
          <CommandItem>Second</CommandItem>
        </CommandList>
      </Command>
    );
    const input = screen.getByPlaceholderText(/search/i);
    input.focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(input.getAttribute("aria-activedescendant")).not.toBe("");
  });
});

describe("high contrast mode", () => {
  it("defines tokens for prefers-contrast: more", () => {
    const css = fs.readFileSync(
      path.join(process.cwd(), "src/app/globals.css"),
      "utf8"
    );
    expect(css).toMatch(/@media \(prefers-contrast: more\)/);
  });
});

