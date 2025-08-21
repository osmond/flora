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
});
