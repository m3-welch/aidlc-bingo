import { describe, expect, it } from "vitest";
import { generateCard } from "@/lib/card";
import { CATALOG, catalogById } from "@/lib/catalog";

describe("generateCard", () => {
  it("has 25 cells, free center, 24 distinct squares, at least one rare and common", () => {
    for (let n = 0; n < 200; n++) {
      const card = generateCard();
      expect(card).toHaveLength(25);
      expect(card[12]).toBe("FREE");
      const rest = card.filter((_, i) => i !== 12);
      expect(new Set(rest).size).toBe(24);
      const rarities = rest.map((id) => catalogById.get(id)?.rarity);
      expect(rarities).toContain("rare");
      expect(rarities).toContain("common");
    }
  });
  it("catalog has unique ids and enough squares", () => {
    expect(new Set(CATALOG.map((s) => s.id)).size).toBe(CATALOG.length);
    expect(CATALOG.length).toBeGreaterThanOrEqual(24);
  });
});
