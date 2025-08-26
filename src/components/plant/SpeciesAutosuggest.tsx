"use client";

import * as React from "react";
import { useDebounce } from "@/lib/use-debounce";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";

type Item = { scientific: string; common?: string };

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

  React.useEffect(() => {
    let cancelled = false;
    async function go() {
      if (!debounced) {
        setItems([]);
        return;
      }
      const res = await fetch(`/api/species?q=${encodeURIComponent(debounced)}`);
      const json = await res.json().catch(() => ({ results: [] }));
      if (!cancelled) setItems(Array.isArray(json?.results) ? json.results : []);
    }
    go();
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  function choose(it: Item) {
    onSelect(it.scientific, it.common);
    setQuery(it.common || it.scientific);
    setOpen(false);
  }

  return (
    <Command
      shouldFilter={false}
      className={cn("relative rounded-md border", className)}
    >
      <CommandInput
        placeholder={placeholder}
        value={query}
        onValueChange={(val) => {
          setQuery(val);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      />
      {open && (
        <CommandList className="absolute z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
          {items.length === 0 && <CommandEmpty>No results found.</CommandEmpty>}
          {items.map((it, idx) => (
            <CommandItem
              key={`${it.scientific}-${idx}`}
              value={it.common || it.scientific}
              onSelect={() => choose(it)}
            >
              <div className="font-medium">{it.common || it.scientific}</div>
              {it.common ? (
                <div className="text-xs text-muted-foreground">{it.scientific}</div>
              ) : null}
            </CommandItem>
          ))}
        </CommandList>
      )}
    </Command>
  );
}
