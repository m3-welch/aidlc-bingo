import { randomInt } from "node:crypto";
import { CATALOG, type Square } from "./catalog";
import { CENTER, FREE, SIZE } from "./bingo";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 25 entries of catalog ids; index 12 is the free center. Mixes 3-6 rare with common squares. */
export function generateCard(catalog: Square[] = CATALOG): string[] {
  const rare = shuffle(catalog.filter((s) => s.rarity === "rare"));
  const common = shuffle(catalog.filter((s) => s.rarity === "common"));
  const total = SIZE * SIZE - 1;
  if (rare.length + common.length < total) throw new Error("Catalog too small");
  const rareCount = Math.min(rare.length, 3 + randomInt(4), total - 1);
  const picked = shuffle([...rare.slice(0, rareCount), ...common.slice(0, total - rareCount)]);
  const ids = picked.map((s) => s.id);
  ids.splice(CENTER, 0, FREE);
  return ids;
}
