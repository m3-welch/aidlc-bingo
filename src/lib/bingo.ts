export const FREE = "FREE";
export const SIZE = 5;
export const CENTER = 12;

const LINES: number[][] = [];
for (let i = 0; i < SIZE; i++) {
  LINES.push(Array.from({ length: SIZE }, (_, j) => i * SIZE + j));
  LINES.push(Array.from({ length: SIZE }, (_, j) => j * SIZE + i));
}
LINES.push(Array.from({ length: SIZE }, (_, i) => i * SIZE + i));
LINES.push(Array.from({ length: SIZE }, (_, i) => i * SIZE + (SIZE - 1 - i)));

/** Returns the first completed line (cell indexes) or null. The free center is always marked. */
export function findWinningLine(marked: boolean[]): number[] | null {
  const m = marked.map((v, i) => v || i === CENTER);
  return LINES.find((line) => line.every((i) => m[i])) ?? null;
}

export function countMarked(marked: boolean[]): number {
  return marked.filter((v, i) => v && i !== CENTER).length;
}
