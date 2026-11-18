import { beforeAll, describe, expect, it } from "vitest";

let m: typeof import("@/lib/mobs");

beforeAll(async () => {
  m = await import("@/lib/mobs");
});

describe("mobs", () => {
  it("creates mobs with unguessable ids and validates names", async () => {
    const a = await m.createMob("  Alpha  ");
    expect(a.name).toBe("Alpha");
    expect(a.id.length).toBeGreaterThanOrEqual(22);
    await expect(m.createMob("")).rejects.toThrow();
    await expect(m.createMob("x".repeat(51))).rejects.toThrow();
    await expect(m.getMob("nope")).rejects.toThrow(m.NotFoundError);
    await expect(m.getMembers("nope")).rejects.toThrow(m.NotFoundError);
  });

  it("joins, rejects duplicate names case-insensitively, and plays to BINGO", async () => {
    const { id } = await m.createMob("Game");
    const { token } = await m.joinMob(id, "Sam");
    await expect(m.joinMob(id, "sam")).rejects.toThrow(m.ConflictError);
    let me = await m.getMyCard(id, token);
    expect(me.card).toHaveLength(25);
    for (const i of [0, 1, 2, 3, 4]) me = await m.setMark(id, token, i, true);
    expect(me.bingo).toBe(true);
    expect((await m.getMembers(id))[0].bingo).toBe(true);
    me = await m.setMark(id, token, 4, false);
    expect(me.bingo).toBe(false);
  });

  it("requires a valid token for card access", async () => {
    const { id } = await m.createMob("Priv");
    const a = await m.joinMob(id, "A");
    const b = await m.joinMob(id, "B");
    await expect(m.getMyCard(id, null)).rejects.toThrow(m.UnauthorizedError);
    await expect(m.getMyCard(id, "bogus")).rejects.toThrow(m.UnauthorizedError);
    expect((await m.getMyCard(id, a.token)).name).toBe("A");
    expect((await m.getMyCard(id, b.token)).name).toBe("B");
    const other = await m.createMob("Other");
    await expect(m.getMyCard(other.id, a.token)).rejects.toThrow(m.UnauthorizedError);
  });

  it("members expose marked positions but never square text", async () => {
    const { id } = await m.createMob("Members");
    const { token } = await m.joinMob(id, "Zed");
    await m.setMark(id, token, 0, true);
    const members = await m.getMembers(id);
    expect(members).toHaveLength(1);
    expect(members[0]).toMatchObject({ name: "Zed", marked: 1, bingo: false });
    expect(members[0].grid).toHaveLength(25);
    expect(members[0].grid.filter(Boolean)).toHaveLength(2);
    expect(members[0].grid[0]).toBe(true);
    expect(JSON.stringify(members)).not.toMatch(/squares|text|card|rarity|joinedAt/);
  });
});
