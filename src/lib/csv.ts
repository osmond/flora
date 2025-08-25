export function toCsv<T extends Record<string, unknown>>(rows: T[]): string {
  const headers = Array.from(new Set(rows.flatMap(r => Object.keys(r))));
  const escape = (v: unknown): string =>
    v === undefined || v === null
      ? ''
      : `"${String(v).replace(/"/g, '""')}"`;
  const lines = rows.map(r => headers.map(h => escape(r[h as keyof T])).join(","));
  return `${headers.join(",")}\n${lines.join("\n")}`;
}
