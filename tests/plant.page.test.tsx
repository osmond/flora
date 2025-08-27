import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderToString } from "react-dom/server";

(globalThis as unknown as { React: typeof React }).React = React;

vi.mock("@/lib/auth", () => ({
  getCurrentUserId: () => Promise.resolve("user-123"),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: () => undefined }),
}));

vi.mock("@/components/AddNoteForm", () => ({ default: () => null }));
vi.mock("@/components/AddPhotoForm", () => ({ default: () => null }));
vi.mock("@/components/CareTimeline", () => ({ default: () => null }));
vi.mock("@/components/DeletePhotoButton", () => ({ default: () => null }));
vi.mock("@/components/CareNudge", () => ({ default: () => null }));
vi.mock("@/components/plant/QuickStats", () => ({ default: () => null }));
vi.mock("@/components/plant/CareCoach", () => ({ default: () => null }));
const plantTabsMock = vi.fn((_: any) => null);
vi.mock("@/components/plant/PlantTabs", () => ({
  default: (props: any) => plantTabsMock(props),
}));
vi.mock("@/components/plant/PhotoGalleryClient", () => ({ default: () => null }));
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
      findFirst: () =>
        Promise.resolve({
          id: "1",
          nickname: "My Plant",
          speciesScientific: "Pothos",
          imageUrl: null,
          room: { name: "Living Room" },
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

const mockOrder = vi.fn();
vi.mock("@/lib/supabaseAdmin", () => ({
  supabaseAdmin: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            order: mockOrder,
          }),
        }),
      }),
    }),
  }),
}));

beforeEach(() => {
  plantTabsMock.mockClear();
  mockOrder.mockImplementation(() => Promise.resolve({ data: [], error: null }));
});

describe("PlantDetailPage", () => {
  it("falls back to latest photo when plant has no main image", async () => {
    const PlantDetailPage = (await import("../src/app/plants/[id]/page")).default;
    const element = await PlantDetailPage({ params: Promise.resolve({ id: "1" }) });
    const html = renderToString(element);
    expect(html).toContain("https://example.com/latest.jpg");
  });

  it("shows plant name, species, and room", async () => {
    const PlantDetailPage = (await import("../src/app/plants/[id]/page")).default;
    const element = await PlantDetailPage({ params: Promise.resolve({ id: "1" }) });
    const html = renderToString(element);
    expect(html).toContain("My Plant");
    expect(html).toContain("Pothos");
    expect(html).toContain("Living Room");
  });

  it("renders mark as watered button", async () => {
    const PlantDetailPage = (await import("../src/app/plants/[id]/page")).default;
    const element = await PlantDetailPage({ params: Promise.resolve({ id: "1" }) });
    const html = renderToString(element);
    expect(html).toContain("Mark as watered");
  });

  it("sets timelineError when events fetch fails", async () => {
    mockOrder.mockResolvedValueOnce({ data: null, error: { message: "fail" } });
    const PlantDetailPage = (await import("../src/app/plants/[id]/page")).default;
    const element = await PlantDetailPage({ params: Promise.resolve({ id: "1" }) });
    renderToString(element);
    expect(plantTabsMock).toHaveBeenCalled();
    const args = plantTabsMock.mock.calls?.[0]?.[0] as any;
    expect(args.timelineError).toBe(true);
  });
});
