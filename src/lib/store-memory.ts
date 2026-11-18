import type { MemberSummary, PlayerRecord, Store } from "./store";

interface MobRecord {
  name: string;
  players: Map<string, PlayerRecord>;
  members: Map<string, MemberSummary>;
}

/** Process-local store for development and tests. Data is lost on restart. */
export class MemoryStore implements Store {
  private mobs = new Map<string, MobRecord>();

  async createMob(id: string, name: string) {
    this.mobs.set(id, { name, players: new Map(), members: new Map() });
  }

  async getMob(id: string) {
    const m = this.mobs.get(id);
    return m ? { id, name: m.name } : null;
  }

  async addPlayer(mobId: string, tokenHash: string, player: PlayerRecord, summary: MemberSummary) {
    const m = this.mobs.get(mobId);
    if (!m) throw new Error("mob missing");
    if (m.members.has(player.nameKey)) return false;
    m.players.set(tokenHash, player);
    m.members.set(player.nameKey, summary);
    return true;
  }

  async getPlayer(mobId: string, tokenHash: string) {
    return this.mobs.get(mobId)?.players.get(tokenHash) ?? null;
  }

  async updatePlayer(mobId: string, tokenHash: string, player: PlayerRecord, summary: MemberSummary) {
    const m = this.mobs.get(mobId);
    if (!m) return;
    m.players.set(tokenHash, player);
    m.members.set(player.nameKey, summary);
  }

  async getMembers(mobId: string) {
    const m = this.mobs.get(mobId);
    return m ? [...m.members.values()].sort((a, b) => a.joinedAt - b.joinedAt) : null;
  }
}
