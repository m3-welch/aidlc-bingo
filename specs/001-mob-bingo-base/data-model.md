# Data Model

- **mobs**: `id TEXT PK`, `name TEXT`, `created_at INTEGER`
- **players**: `id TEXT PK`, `mob_id FK`, `name TEXT`, `name_key TEXT` (lowercased; UNIQUE with mob_id), `token_hash TEXT`, `squares TEXT` (JSON array of 25 catalog ids, index 12 = `"FREE"`), `marked TEXT` (JSON array of 25 booleans; index 12 always true), `bingo INTEGER`, `created_at INTEGER`
- **Square (catalog, code)**: `{ id, text, rarity: "common" | "rare" }`

Validation: mob name 1–50, player name 1–30, trimmed, no control characters.
