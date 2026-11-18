# API Contract

All bodies JSON. Errors: `{ "error": string }` with 400 (validation), 401 (bad token), 404 (unknown mob), 409 (name taken).

| Method & Path | Auth | Request | Response |
|---|---|---|---|
| `POST /api/mobs` | – | `{ name }` | 201 `{ id, name }` |
| `GET /api/mobs/{id}` | – | – | `{ id, name }` |
| `POST /api/mobs/{id}/join` | – | `{ name }` | 201 `{ token, player: { name } }` |
| `GET /api/mobs/{id}/me` | Bearer | – | `{ name, card: [{ index, text, rarity, free, marked }], bingo, winningLine }` |
| `PUT /api/mobs/{id}/me/squares/{index}` | Bearer | `{ marked: boolean }` | same as `/me` |
| `GET /api/mobs/{id}/members` | – | – | `{ members: [{ name, marked, bingo, grid: boolean[25] }] }` |
| `GET /api/mobs/{id}/events` | – | – | SSE stream; event `members` with the members payload |

No endpoint lists mobs. `members` includes marked positions (`grid`) but never square text or rarity.
