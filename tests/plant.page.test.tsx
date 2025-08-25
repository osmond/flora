import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";

(globalThis as unknown as { React: typeof React }).React = React;

vi.mock("@/lib/auth", () => ({
  getCurrentUserId: () => "user-123",
}));

vi.mock("@/components/AddNoteForm", () => ({ default: () => null }));
vi.mock("@/components/AddPhotoForm", () => ({ default: () => null }));
vi.mock("@/components/CareTimeline", () => ({ default: () => null }));
vi.mock("@/components/DeletePhotoButton", () => ({ default: () => null }));
vi.mock("@/components/CareSuggestion", () => ({ default: () => null }));
vi.mock("@/components/PhotoGallery", () => ({ default: () => null }));
vi.mock("@/components/plant/QuickStats", () => ({ default: () => null }));
vi.mock("@/components/plant/CareCoach", () => ({ default: () => null }));
vi.mock("@/lib/supabaseAdmin", () => ({
  supabaseAdmin: {
    from: () => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            order: () => Promise.resolve({ data: [] }),
          }),
        }),
      }),
    }),
  },
}));
vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element
  default: (props: React.ComponentProps<"img">) => <img {...props} alt={props.alt ?? ""} />,
}));
vi.mock("@/components/ui/tabs", () => ({
  Tabs: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsList: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/ui/button", () => ({
  Button: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
}));
vi.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/ui/separator", () => ({
  Separator: () => <div />,
}));
vi.mock("@/components/ui/textarea", () => ({
  Textarea: ({ children }: { children?: React.ReactNode }) => <textarea>{children}</textarea>,
}));
vi.mock("@/components/ui/label", () => ({
  Label: ({ children }: { children: React.ReactNode }) => <label>{children}</label>,
}));
vi.mock("@/components/ui", () => ({ Button: ({ children }: { children: React.ReactNode }) => <button>{children}</button> }));

vi.mock("@/lib/db", () => ({
  default: {
    plant: {
      findUnique: () =>
        Promise.resolve({
          id: "plant-1",
          name: "My Plant",
          species: null,
          imageUrl: null,
        }),
    },
    photo: {
      findFirst: () =>
        Promise.resolve({
          url: "https://example.com/latest.jpg",
        }),
    },
  },
}));

describe("PlantDetailPage", () => {
  it("falls back to latest photo when plant has no main image", async () => {
    const PlantDetailPage = (await import("../src/app/plants/[id]/page")).default;
    const element = await PlantDetailPage({ params: { id: "plant-1" } });
    const html = renderToString(element);
    expect(html).toContain("https://example.com/latest.jpg");
  });
});

