export function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return '';
  const headers = Array.from(
    rows.reduce((set, row) => {
      Object.keys(row).forEach((k) => set.add(k));
      return set;
    }, new Set<string>())
  );
  const escape = (val: unknown) => {
    const str = val === undefined || val === null ? '' : String(val);
    if (str === '') return '';
    return '"' + str.replace(/"/g, '""') + '"';
  };
  const lines = rows.map((row) => headers.map((h) => escape((row as any)[h])).join(','));
  return [headers.join(','), ...lines].join('\n');
}
