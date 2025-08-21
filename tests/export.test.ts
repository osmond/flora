import { describe, it, expect } from "vitest";
import { toCsv } from "../src/lib/csv";

describe("toCsv", () => {
  it("handles quotes, commas, and newlines", () => {
    const rows = [
      {
        name: 'Alice, Bob',
        note: 'Line1\nLine2',
        quote: 'She said "Hello"',
      },
    ];
    const csv = toCsv(rows);
    expect(csv).toBe(
      'name,note,quote\n"Alice, Bob","Line1\nLine2","She said ""Hello"""'
    );
  });

  it("includes headers from all rows", () => {
    const rows = [
      { a: 1, b: 2 },
      { b: 3, c: 4 },
    ];
    const csv = toCsv(rows);
    // The second column exists only on the first row and the first column exists
    // only on the second row. Those missing values should still appear as empty
    // cells in the CSV output.
    expect(csv).toBe('a,b,c\n"1","2",\n,"3","4"');
  });
});
