import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getMob: vi.fn(),
  getPlayers: vi.fn(),
  updateMob: vi.fn(),
}));

vi.mock("@google-cloud/firestore", () => ({
  Firestore: class {
    collection() {
      return {
        doc: () => ({
          get: mocks.getMob,
          update: mocks.updateMob,
          collection: () => ({ get: mocks.getPlayers }),
        }),
      };
    }
  },
}));

import { createHash } from "node:crypto";
import { CATALOG, rarePositions } from "@/lib/catalog";
import { FirestoreStore } from "@/lib/store-firestore";

beforeEach(() => vi.resetAllMocks());

describe("Firestore member rarity", () => {
  it("backfills existing members without overwriting their progress", async () => {
    const squares = [CATALOG.find((s) => s.rarity === "rare")!.id, CATALOG[0].id];
    const key = createHash("sha1").update("sam").digest("hex");
    const member = { name: "Sam", marked: 1, bingo: false, grid: [true, false], joinedAt: 1 };
    mocks.getMob.mockResolvedValue({ exists: true, get: () => ({ [key]: member }) });
    mocks.getPlayers.mockResolvedValue({ docs: [{ data: () => ({ nameKey: "sam", squares }) }] });

    const members = await new FirestoreStore().getMembers("mob");

    expect(members?.[0]).toMatchObject({ ...member, rare: rarePositions(squares) });
    expect(mocks.updateMob).toHaveBeenCalledWith({ [`members.${key}.rare`]: [true, false] });
  });

  it("fails explicitly if an existing member has no player record", async () => {
    mocks.getMob.mockResolvedValue({ exists: true, get: () => ({ missing: { name: "Missing" } }) });
    mocks.getPlayers.mockResolvedValue({ docs: [] });
    await expect(new FirestoreStore().getMembers("mob")).rejects.toThrow("Missing player record");
    expect(mocks.updateMob).not.toHaveBeenCalled();
  });
});
