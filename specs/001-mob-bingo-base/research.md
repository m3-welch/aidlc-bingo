# Research

- **SQLite driver**: `node:sqlite` (built into Node 22.5+) avoids native compilation; chosen over better-sqlite3 for simplicity. Trade-off: experimental flag warning on some versions.
- **Real-time**: SSE over WebSockets because updates are one-way and Next.js route handlers support streaming natively. In-process event emitter is sufficient for a single server instance.
- **Identity**: bearer token hashed at rest; no cookies so tokens are scoped per mob in `localStorage`.
- **Mob ids**: 16 random bytes (128 bits) base64url — unguessable.
