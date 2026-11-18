import { randomBytes } from "node:crypto";
import { catalogById } from "./catalog";
import { CENTER, FREE, SIZE, countMarked, findWinningLine } from "./bingo";
import { generateCard } from "./card";
import { hashToken, newToken } from "./auth";
import { getStore, type MemberSummary, type PlayerRecord } from "./store";
import { validateMobName, validatePlayerName } from "./validate";

export class NotFoundError extends Error {}
export class ConflictError extends Error {}
export class UnauthorizedError extends Error {}

export interface CardCell {
  index: number;
  text: string;
  rarity: "common" | "rare" | "free";
  free: boolean;
  marked: boolean;
}
export interface MyCard {
  name: string;
  card: CardCell[];
  bingo: boolean;
  winningLine: number[] | null;
}
export type Member = Omit<MemberSummary, "joinedAt">;

function summarise(p: PlayerRecord): MemberSummary {
  const grid = p.marked.map((v, i) => v || i === CENTER);
  return { name: p.name, marked: countMarked(grid), bingo: findWinningLine(grid) !== null, grid, joinedAt: p.joinedAt };
}

export async function createMob(name: unknown) {
  const clean = validateMobName(name);
  const id = randomBytes(16).toString("base64url");
  await (await getStore()).createMob(id, clean);
  return { id, name: clean };
}

export async function getMob(id: string) {
  const mob = await (await getStore()).getMob(id);
  if (!mob) throw new NotFoundError("Mob not found");
  return mob;
}

export async function joinMob(mobId: string, name: unknown) {
  await getMob(mobId);
  const clean = validatePlayerName(name);
  const token = newToken();
  const squares = generateCard();
  const player: PlayerRecord = {
    name: clean,
    nameKey: clean.toLowerCase(),
    squares,
    marked: squares.map((_, i) => i === CENTER),
    joinedAt: Date.now(),
  };
  const ok = await (await getStore()).addPlayer(mobId, hashToken(token), player, summarise(player));
  if (!ok) throw new ConflictError("That name is already taken in this mob");
  return { token, player: { name: clean } };
}

async function authPlayer(mobId: string, token: string | null) {
  if (!token) throw new UnauthorizedError("Missing token");
  const hash = hashToken(token);
  const player = await (await getStore()).getPlayer(mobId, hash);
  if (!player) throw new UnauthorizedError("Invalid token");
  return { player, hash };
}

function toCard(p: PlayerRecord): MyCard {
  const line = findWinningLine(p.marked);
  const card = p.squares.map((id, index): CardCell => {
    if (id === FREE) return { index, text: "FREE", rarity: "free", free: true, marked: true };
    const sq = catalogById.get(id);
    return { index, text: sq?.text ?? id, rarity: sq?.rarity ?? "common", free: false, marked: p.marked[index] };
  });
  return { name: p.name, card, bingo: line !== null, winningLine: line };
}

export async function getMyCard(mobId: string, token: string | null): Promise<MyCard> {
  return toCard((await authPlayer(mobId, token)).player);
}

export async function setMark(mobId: string, token: string | null, index: unknown, value: unknown): Promise<MyCard> {
  const { player, hash } = await authPlayer(mobId, token);
  if (!Number.isInteger(index) || (index as number) < 0 || (index as number) >= SIZE * SIZE) {
    throw new RangeError("Invalid square index");
  }
  if (typeof value !== "boolean") throw new RangeError("marked must be a boolean");
  const i = index as number;
  if (i === CENTER) return toCard(player);
  const next: PlayerRecord = { ...player, marked: player.marked.map((v, j) => (j === i ? value : v)) };
  await (await getStore()).updatePlayer(mobId, hash, next, summarise(next));
  return toCard(next);
}

/** Progress only: marked positions are visible to the mob, but never square text. */
export async function getMembers(mobId: string): Promise<Member[]> {
  const members = await (await getStore()).getMembers(mobId);
  if (!members) throw new NotFoundError("Mob not found");
  return members.map(({ joinedAt: _joinedAt, ...rest }) => rest);
}
