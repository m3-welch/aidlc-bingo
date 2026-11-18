export interface PlayerRecord {
  name: string;
  nameKey: string;
  squares: string[];
  marked: boolean[];
  joinedAt: number;
}

/** Public progress and rarity positions, never square text. */
export interface MemberSummary {
  name: string;
  marked: number;
  bingo: boolean;
  grid: boolean[];
  rare: boolean[];
  joinedAt: number;
}

export interface Store {
  createMob(id: string, name: string): Promise<void>;
  getMob(id: string): Promise<{ id: string; name: string } | null>;
  /** Returns false when the (case-insensitive) name is already taken in the mob. */
  addPlayer(mobId: string, tokenHash: string, player: PlayerRecord, summary: MemberSummary): Promise<boolean>;
  getPlayer(mobId: string, tokenHash: string): Promise<PlayerRecord | null>;
  updatePlayer(mobId: string, tokenHash: string, player: PlayerRecord, summary: MemberSummary): Promise<void>;
  /** Null when the mob does not exist. */
  getMembers(mobId: string): Promise<MemberSummary[] | null>;
}

const g = globalThis as unknown as { __bingoStore?: Store };

export async function getStore(): Promise<Store> {
  if (g.__bingoStore) return g.__bingoStore;
  if (process.env.STORE === "firestore") {
    const { FirestoreStore } = await import("./store-firestore");
    g.__bingoStore = new FirestoreStore();
  } else {
    const { MemoryStore } = await import("./store-memory");
    g.__bingoStore = new MemoryStore();
  }
  return g.__bingoStore;
}
