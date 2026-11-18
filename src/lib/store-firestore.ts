import { createHash } from "node:crypto";
import { Firestore } from "@google-cloud/firestore";
import type { MemberSummary, PlayerRecord, Store } from "./store";

const MEMBERS_TTL_MS = 2000;

/**
 * Layout (kept to few reads to stay in the free tier):
 *   mobs/{mobId}                 { name, createdAt, members: { [hash(nameKey)]: MemberSummary } }
 *   mobs/{mobId}/players/{token} PlayerRecord   (doc id = SHA-256 of the player's token)
 * Polling clients only read the single mob doc; a short per-instance cache collapses bursts.
 */
export class FirestoreStore implements Store {
  private db = new Firestore();
  private cache = new Map<string, { at: number; value: MemberSummary[] | null }>();

  private mob(id: string) {
    return this.db.collection("mobs").doc(id);
  }
  private memberKey(nameKey: string) {
    return createHash("sha1").update(nameKey).digest("hex");
  }

  async createMob(id: string, name: string) {
    await this.mob(id).create({ name, createdAt: Date.now(), members: {} });
  }

  async getMob(id: string) {
    const snap = await this.mob(id).get();
    return snap.exists ? { id, name: snap.get("name") as string } : null;
  }

  async addPlayer(mobId: string, tokenHash: string, player: PlayerRecord, summary: MemberSummary) {
    const mobRef = this.mob(mobId);
    const key = this.memberKey(player.nameKey);
    return this.db.runTransaction(async (tx) => {
      const snap = await tx.get(mobRef);
      if (!snap.exists) throw new Error("mob missing");
      const members = (snap.get("members") ?? {}) as Record<string, unknown>;
      if (key in members) return false;
      tx.update(mobRef, { [`members.${key}`]: summary });
      tx.create(mobRef.collection("players").doc(tokenHash), player);
      return true;
    });
  }

  async getPlayer(mobId: string, tokenHash: string) {
    const snap = await this.mob(mobId).collection("players").doc(tokenHash).get();
    return snap.exists ? (snap.data() as PlayerRecord) : null;
  }

  async updatePlayer(mobId: string, tokenHash: string, player: PlayerRecord, summary: MemberSummary) {
    const mobRef = this.mob(mobId);
    const batch = this.db.batch();
    batch.set(mobRef.collection("players").doc(tokenHash), player);
    batch.update(mobRef, { [`members.${this.memberKey(player.nameKey)}`]: summary });
    await batch.commit();
    this.cache.delete(mobId);
  }

  async getMembers(mobId: string) {
    const hit = this.cache.get(mobId);
    if (hit && Date.now() - hit.at < MEMBERS_TTL_MS) return hit.value;
    const snap = await this.mob(mobId).get();
    const members = snap.exists
      ? Object.values((snap.get("members") ?? {}) as Record<string, MemberSummary>).sort((a, b) => a.joinedAt - b.joinedAt)
      : null;
    this.cache.set(mobId, { at: Date.now(), value: members });
    return members;
  }
}
