"use client";

import * as React from "react";
import { useDebounce } from "@/lib/use-debounce";
import { cn } from "@/lib/utils";

type Item = { scientific: string; common?: string }

export default function SpeciesAutosuggest(props: {
  value?: string;
  onSelect: (scientific: string, common?: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const { value = "", onSelect, placeholder = "Search species…", className } = props;
  const [query, setQuery] = React.useState(value);
  const debounced = useDebounce(query, 350);
  const [items, setItems] = React.useState<Item[]>([]);
  const [open, setOpen] = React.useState(false);
  const [highlight, setHighlight] = React.useState(0);

  React.useEffect(() => {
    let cancelled = false;
    async function go() {
      if (!debounced) { setItems([]); return; }
      const res = await fetch(`/api/species?q=${encodeURIComponent(debounced)}`);
      const json = await res.json().catch(() => ({ results: [] }));
      if (!cancelled) setItems(Array.isArray(json?.results) ? json.results : []);
    }
    go();
    return () => { cancelled = true; };
  }, [debounced]);

  function choose(it: Item) {
    onSelect(it.scientific, it.common);
    setQuery(it.common || it.scientific);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || items.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlight(h => Math.min(h + 1, items.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlight(h => Math.max(h - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); choose(items[highlight]); }
    else if (e.key === "Escape") { setOpen(false); }
  }

  return (
    <div className={cn("relative", className)}>
      <input
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        placeholder={placeholder}
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
      />
      {open && items.length > 0 && (
        <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-input bg-popover text-popover-foreground shadow-md">
          <ul className="max-h-64 overflow-auto py-1 text-sm">
            {items.map((it, idx) => (
              <li
                key={`${it.scientific}-${idx}`}
                className={cn(
                  "cursor-pointer px-3 py-2",
                  idx === highlight ? "bg-accent text-accent-foreground" : "hover:bg-accent/60"
                )}
                onMouseEnter={() => setHighlight(idx)}
                onMouseDown={(e) => { e.preventDefault(); choose(it); }}
              >
                <div className="font-medium">{it.common || it.scientific}</div>
                {it.common ? <div className="text-xs text-muted-foreground">{it.scientific}</div> : null}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
