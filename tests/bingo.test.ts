import { describe, expect, it } from "vitest";
import { findWinningLine } from "@/lib/bingo";

const blank = () => Array<boolean>(25).fill(false);

describe("findWinningLine", () => {
  it("is null with only the free center", () => expect(findWinningLine(blank())).toBeNull());
  it("detects a row", () => {
    const m = blank();
    [5, 6, 7, 8, 9].forEach((i) => (m[i] = true));
    expect(findWinningLine(m)).toEqual([5, 6, 7, 8, 9]);
  });
  it("detects a column", () => {
    const m = blank();
    [2, 7, 17, 22].forEach((i) => (m[i] = true));
    expect(findWinningLine(m)).toEqual([2, 7, 12, 17, 22]);
  });
  it("detects diagonals using the free center", () => {
    const m = blank();
    [0, 6, 18, 24].forEach((i) => (m[i] = true));
    expect(findWinningLine(m)).toEqual([0, 6, 12, 18, 24]);
  });
  it("is null for four of a row without a free cell", () => {
    const m = blank();
    [0, 1, 2, 3].forEach((i) => (m[i] = true));
    expect(findWinningLine(m)).toBeNull();
  });
});
