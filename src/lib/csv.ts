export function toCsv<T extends Record<string, unknown>>(rows: T[]): string {
  if (!rows.length) return "";
  // Collect a deterministic set of headers from all rows.
  // Using only the first row could drop fields that appear in later rows.
  const headers = Array.from(
    rows.reduce((set, row) => {
      Object.keys(row).forEach((key) => set.add(key));
      return set;
    }, new Set<string>())
  );
  const escape = (val: unknown) => {
    if (val === null || val === undefined) return "";
    return `"${String(val).replace(/"/g, '""')}"`;
  };
  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((h) => escape(row[h as keyof T])).join(","),
    ),
  ];
  return lines.join("\n");
}
