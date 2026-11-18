# aidlc-bingo
Shared session that produces a bingo card for each person on an AI-DLC mob.

Create a named **mob**, share its link, and everyone who joins (with a name of their choice) gets a private 5x5 bingo card of AI-DLC behaviours (common and rare squares, free center). Mobs are never listed; the link is the only way in. Players see each other's progress live (which squares are marked, rare square positions, and BINGO status), but never what the squares say.

## Develop

Requires Node 22+.

```sh
npm install
npm run dev        # http://localhost:3000
npm test           # unit + privacy tests
npm run typecheck
npm run build && npm start
```

Local dev uses an in-memory store (data is lost on restart); production uses Firestore (`STORE=firestore`). Deploy to Cloud Run with GitHub Actions: see [docs/DEPLOY.md](docs/DEPLOY.md). Edit bingo squares in `src/lib/catalog.ts`.

Specs live in `specs/001-mob-bingo-base/` (Spec Kit).
