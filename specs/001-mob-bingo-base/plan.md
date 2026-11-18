# Implementation Plan: Mob Bingo Base

**Branch**: `001-mob-bingo-base` | **Date**: 2026-11-18 | **Spec**: [spec.md](spec.md)

## Summary

Next.js (App Router) full-stack app. Route handlers expose a small JSON API backed by SQLite
(Node's built-in `node:sqlite`, no native build). Card generation and win detection are pure
functions in `src/lib`. Live member progress is pushed via Server-Sent Events.

## Technical Context

**Language/Version**: TypeScript (strict), Node 22+
**Primary Dependencies**: Next.js, React; no other runtime deps
**Storage**: Firestore (prod) / in-memory (dev, tests) via `Store` interface — see specs/002-cloud-run-deploy
**Testing**: Vitest (unit + route-level privacy tests)
**Target Platform**: Node server, responsive web
**Project Type**: web application (single Next.js project)
**Performance Goals**: updates visible to other players in <3s
**Constraints**: card contents never leave the owner's authenticated requests
**Scale/Scope**: ≤50 players per mob, small number of mobs

## Constitution Check

- I Link-Only Privacy: mob id = 16 random bytes, base64url; no list endpoint. PASS
- II Hidden Cards: `/members` returns name/count/bingo/marked-grid only (no square text); `/me` requires player token. PASS
- III Simplicity: no accounts, one SQLite file, in-process SSE. PASS
- IV Test the Rules: Vitest for generator, win detection, privacy. PASS
- V Strict Typing/Validation: strict TS, zod-free hand validators in `src/lib/validate.ts`; React escapes output. PASS

## Design

- **Identity**: join returns a random `token`; stored in `localStorage` per mob; sent as `Authorization: Bearer`. Only its SHA-256 hash is stored.
- **API** (see `contracts/api.md`):
  - `POST /api/mobs` → `{ id, name }`
  - `GET /api/mobs/[id]` → `{ id, name }` or 404
  - `POST /api/mobs/[id]/join` → `{ token, player }`
  - `GET /api/mobs/[id]/me` (auth) → own card
  - `PUT /api/mobs/[id]/me/squares/[index]` (auth) → toggle mark
  - `GET /api/mobs/[id]/members` → names/counts/bingo
  - `GET /api/mobs/[id]/events` → SSE, emits `members` on change
- **Pages**: `/` create form; `/m/[id]` join form or card + member list.
- **Card generation**: 24 squares sampled without replacement; rare count random in 3–6 (bounded by catalog); shuffled; index 12 is free.

## Project Structure

```text
specs/001-mob-bingo-base/{spec,plan,research,data-model,tasks}.md, contracts/api.md
src/
├── app/ (page.tsx, m/[id]/page.tsx, api/mobs/**/route.ts, layout.tsx, globals.css)
├── components/ (CreateMobForm, MobView, BingoCard, MemberList)
└── lib/ (catalog.ts, card.ts, bingo.ts, db.ts, mobs.ts, validate.ts, events.ts, auth.ts)
tests/ (card.test.ts, bingo.test.ts, mobs.test.ts)
```

**Structure Decision**: single Next.js project, logic in `src/lib` for testability.
