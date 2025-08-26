# 🎨 Flora App Design Tasks (with shadcn/ui)

This document outlines the **design & UX tasks** needed to bring Flora to life, using **Tailwind v4 + shadcn/ui** as the foundation.  
It complements `implementation-tasks.md` by focusing on **look, feel, and component polish**.  
Includes **starter code snippets** to guide developers.

---

## 0. Foundations

- [ ] **Color System**
  - Audit and finalize HSL tokens in `globals.css`
  - Verify contrast ratios (WCAG AA) in both dark/light
  - Tokens map directly into shadcn/ui `theme.config.json`

- [ ] **Typography**
  - Confirm `Inter` as base font (UI + body)
  - Use shadcn/ui **`<Label>`** for all field labels
  - Size scale: `text-xs → text-2xl` with shadcn/ui variants

- [ ] **Spacing & Layout**
  - Global rhythm = 4/8/16px increments
  - Cards → `rounded-2xl` via shadcn/ui `<Card>`
  - Inputs/Buttons → `rounded-md`, use shadcn/ui `<Input>` + `<Button>`

---

## 1. Navigation & App Shell

- [x] **App Shell**
  - Use shadcn/ui `<NavigationMenu>` for top nav (desktop)
  - Mobile → bottom nav with icons, highlight active tab
  - Add consistent padding (`px-4 md:px-6`)

**Starter Code:**
```tsx
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu"

export function SiteNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="/">Home</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/plants">Plants</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/today">Today</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
```

---
## 2. Add a Plant Flow

- [x] **Form Styling**
  - Use shadcn/ui `<Form>`, `<FormField>`, `<Input>`, `<Label>`
  - Primary button = `<Button>` default variant
  - Secondary/expanders = `<Button variant="outline">`

**Starter Code:**
```tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AddPlantForm() {
  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Add a Plant</h1>
      <div className="space-y-2">
        <Label htmlFor="nickname">Nickname</Label>
        <Input id="nickname" placeholder="e.g. Kay" className="h-10" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="species">Species</Label>
        <Input id="species" placeholder="Search species…" className="h-10" />
      </div>
      <Button className="w-full">Create Plant</Button>
    </div>
  )
}
```

- [x] **Species Autosuggest**
  - Wrap in shadcn/ui `<Command>` component
  - Each suggestion = `<CommandItem>` with optional image on left

**Starter Code:**
```tsx
import { Command, CommandList, CommandItem, CommandInput } from "@/components/ui/command"

export function SpeciesAutosuggest() {
  return (
    <Command className="rounded-md border">
      <CommandInput placeholder="Search species…" />
      <CommandList>
        <CommandItem value="pothos">Pothos</CommandItem>
        <CommandItem value="ficus">Ficus</CommandItem>
      </CommandList>
    </Command>
  )
}
```

---

## 3. Plant Detail Page

- [x] **Hero Section**
  - Crop hero photo consistently (16:9)
  - Overlay gradient for text legibility
  - Room badge = pill style

**Starter Code:**
```tsx
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function PlantHero() {
  return (
    <div>
      <Image src="/placeholder.png" alt="Plant" width={800} height={400} className="w-full h-48 object-cover rounded-xl" />
      <div className="mt-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Kay</h2>
          <p className="text-sm text-muted-foreground">Epipremnum aureum</p>
        </div>
        <Badge>Living Room</Badge>
        <Button variant="outline" size="sm">Edit</Button>
      </div>
    </div>
  )
}
```

---

## 4. Today View (Tasks)

- [x] **Task Card**
  - Base on shadcn/ui `<Card>`
  - Avatar left, task title/desc middle, button right

**Starter Code:**
```tsx
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function TaskCard() {
  return (
    <Card className="flex items-center gap-3 px-3 py-3">
      <Avatar><AvatarFallback>🌱</AvatarFallback></Avatar>
      <CardContent className="flex-1 min-w-0">
        <div className="text-sm font-medium">Water Kay</div>
        <div className="text-xs text-muted-foreground">Overdue by 2d</div>
      </CardContent>
      <Button size="sm">Done</Button>
    </Card>
  )
}
```

---

## 5. AI Care Coach

- [x] **Nudge Card**
  - Use shadcn/ui `<Alert>` with accent border
  - Buttons inside → Apply/Dismiss

**Starter Code:**
```tsx
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function CareNudge() {
  return (
    <Alert>
      <AlertTitle>AI Suggestion</AlertTitle>
      <AlertDescription>
        Skip watering Kay today — humidity is high 🌧
      </AlertDescription>
      <div className="mt-2 flex gap-2">
        <Button size="sm">Apply</Button>
        <Button size="sm" variant="outline">Dismiss</Button>
      </div>
    </Alert>
  )
}
```

---

## 6. Dashboard & Insights

- [x] **Metrics Widgets**
  - Use shadcn/ui `<Card>` with large number + subtitle

**Starter Code:**
```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function DashboardStat() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">Weekly Completion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">85%</div>
      </CardContent>
    </Card>
  )
}
```

---

## 7. Motion & Microinteractions

- [x] Use **framer-motion** with shadcn/ui
- [x] Loading skeletons → shadcn/ui `<Skeleton>`

**Starter Code:**
```tsx
import { Skeleton } from "@/components/ui/skeleton"

export function TaskSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  )
}
```

---

## 8. Accessibility

- [ ] Ensure shadcn/ui defaults (`aria-*` props) aren’t removed
- [ ] Add alt text for plant photos
- [ ] Test keyboard nav across `<Tabs>`, `<DropdownMenu>`, `<Command>`
- [ ] Confirm high-contrast mode works with tokens

---

## 9. Design QA Checklist

- [ ] Typography hierarchy matches style guide
- [ ] Colors consistent with tokens in both light/dark
- [ ] shadcn/ui variants (default, outline, destructive) used consistently
- [ ] Responsive layouts tested at `sm`, `md`, `lg`
- [ ] Hover, focus, disabled states defined and visible

---
