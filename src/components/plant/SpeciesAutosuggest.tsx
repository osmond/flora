"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { useDebounce } from "@/lib/use-debounce";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";

type Item = { scientific: string; common?: string; image?: string };

export default function SpeciesAutosuggest(props: {
  value?: string;
  onSelect: (scientific: string, common?: string) => void;
  onInputChange?: (val: string) => void;
  placeholder?: string;
  className?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  const {
    value = "",
    onSelect,
    onInputChange,
    placeholder = "Search species…",
    className,
    inputProps,
  } = props;
  const [query, setQuery] = React.useState(value);
  const debounced = useDebounce(query, 350);
  const [items, setItems] = React.useState<Item[]>([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    async function fetchImage(scientific: string) {
      try {
        const res = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(scientific)}`
        );
        const json = await res.json();
        return (json as any)?.thumbnail?.source as string | undefined;
      } catch {
        return undefined;
      }
    }
    async function go() {
      if (!debounced) {
        setItems([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/species?q=${encodeURIComponent(debounced)}`);
        if (!res.ok) throw new Error("Request failed");
        const json = await res.json().catch(() => []);
        let items: Item[] = Array.isArray(json)
          ? json
          : Array.isArray((json as any)?.results)
            ? (json as any).results
            : [];
        items = await Promise.all(
          items.map(async (it) => ({
            ...it,
            image: await fetchImage(it.scientific),
          }))
        );
        if (!cancelled) setItems(items);
      } catch {
        if (!cancelled) {
          setError("Could not load suggestions.");
          setItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
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
          onInputChange?.(val);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        {...inputProps}
      />
      {open && (
        <CommandList className="absolute z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
          {loading ? (
            <div className="flex items-center justify-center p-2">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : error ? (
            <>
              <CommandEmpty>{error}</CommandEmpty>
              {query && (
                <CommandItem value={query} onSelect={() => choose({ scientific: query })}>
                  Use &quot;{query}&quot; anyway
                </CommandItem>
              )}
            </>
          ) : (
            <>
              {items.length === 0 && <CommandEmpty>No results found.</CommandEmpty>}
              {items.map((it, idx) => (
                <CommandItem
                  key={`${it.scientific}-${idx}`}
                  value={it.common || it.scientific}
                  onSelect={() => choose(it)}
                >
                  {it.image ? (
                    <img
                      src={it.image}
                      alt={it.common || it.scientific}
                      className="mr-2 h-6 w-6 rounded object-cover"
                    />
                  ) : null}
                  <div className="font-medium">{it.common || it.scientific}</div>
                  {it.common ? (
                    <div className="text-xs text-muted-foreground">{it.scientific}</div>
                  ) : null}
                </CommandItem>
              ))}
            </>
          )}
        </CommandList>
      )}
    </Command>
  );
}
