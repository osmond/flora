# 🌿 Flora Style Guide

This document defines the visual and UX standards for the Flora app.

## 🎨 Colors

| Token         | Hex       | Role                       |
|---------------|-----------|----------------------------|
| Primary       | #508C7E   | Main accents               |
| Secondary     | #D3EDE6   | Highlights, backgrounds    |
| Background    | #F9F9F9   | App base background        |
| Foreground    | #111827   | Main text                  |
| Muted         | #9CA3AF   | Descriptive text, labels   |

### Tailwind & shadcn mapping

| Token     | Tailwind classes                     | shadcn CSS variables                     |
|-----------|--------------------------------------|------------------------------------------|
| Primary   | `bg-primary`, `text-primary-foreground`         | `--primary`, `--primary-foreground`     |
| Secondary | `bg-secondary`, `text-secondary-foreground`     | `--secondary`, `--secondary-foreground` |
| Background| `bg-background`, `text-foreground`               | `--background`, `--foreground`          |
| Foreground| `text-foreground`                                | `--foreground`                          |
| Muted     | `bg-muted`, `text-muted-foreground`              | `--muted`, `--muted-foreground`        |

```tsx
// components/Example.tsx
export function Example() {
  return (
    <div className="bg-primary text-primary-foreground p-4 rounded-lg">
      <p className="text-muted-foreground">Water me today!</p>
    </div>
  );
}
```

