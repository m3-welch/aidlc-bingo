# Tasks: Mob Bingo Base

**Input**: `specs/001-mob-bingo-base/` (spec, plan, data-model, contracts)
Format: `[ID] [P?] [Story] Description` — [P] = parallelizable.

## Phase 1: Setup
- [x] T001 Create Next.js TS project config: `package.json`, `tsconfig.json` (strict), `next.config.ts`, `vitest.config.ts`, `.gitignore`
- [x] T002 Install dependencies (next, react, react-dom, typescript, vitest, @types/*)

## Phase 2: Foundational
- [x] T003 [P] `src/lib/catalog.ts`: AI-DLC squares (≥40 common, ≥10 rare)
- [x] T004 [P] `src/lib/bingo.ts`: win detection (rows, cols, diagonals, free center)
- [x] T005 [P] `src/lib/card.ts`: card generation (24 distinct, ≥1 rare, free center at 12)
- [x] T006 [P] `src/lib/validate.ts`: name validators
- [x] T007 `src/lib/db.ts`: SQLite init + schema
- [x] T008 `src/lib/events.ts`, `src/lib/auth.ts`: pub/sub and token hashing/extraction
- [x] T009 `src/lib/mobs.ts`: create/get mob, join, get card, toggle, members
- [x] T010 [P] Tests: `tests/card.test.ts`, `tests/bingo.test.ts`, `tests/mobs.test.ts` (incl. privacy)

## Phase 3: US1 Create Mob (P1)
- [x] T011 [US1] `POST /api/mobs`, `GET /api/mobs/[id]` routes
- [x] T012 [US1] `layout.tsx`, `globals.css`, `page.tsx`, `CreateMobForm` (no mob listing)

## Phase 4: US2 Join (P1)
- [x] T013 [US2] `join` and `me` routes
- [x] T014 [US2] `m/[id]/page.tsx`, `MobView` join form, localStorage token, not-found state

## Phase 5: US3 Play (P1)
- [x] T015 [US3] `PUT me/squares/[index]` route
- [x] T016 [US3] `BingoCard` component: toggle, rare styling, BINGO highlight

## Phase 6: US4 Progress (P2)
- [x] T017 [US4] `members` and `events` (SSE) routes
- [x] T018 [US4] `MemberList` component with live updates

## Phase 7: Polish
- [x] T019 README usage; share-link copy button; responsive CSS
- [x] T020 Run tests, type-check, build, and manual smoke test of quickstart flow
