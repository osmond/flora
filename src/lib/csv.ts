export function toCsv(rows: Record<string, any>[]): string {
  const headers = Array.from(new Set(rows.flatMap(r => Object.keys(r))));
  const escape = (v: any) =>
    v === undefined || v === null
      ? ''
      : `"${String(v).replace(/"/g, '""')}"`;
  const lines = rows.map(r => headers.map(h => escape(r[h])).join(","));
  return `${headers.join(",")}\n${lines.join("\n")}`;
}
