# AI-DLC Bingo Constitution

## Core Principles

### I. Link-Only Privacy
Mobs MUST NOT be listed, enumerated, or searchable. A mob is reachable only through its
unguessable share link. Mob identifiers MUST be generated from a cryptographically secure
random source. Rationale: the link is the only access control, so it must not be guessable.

### II. Hidden Card Contents
The text and rarity of a player's squares MUST only ever be returned to that player. Other
players MAY see which positions on that card are marked, plus marked count and BINGO status.
This MUST be enforced server-side, never by hiding data in the UI. Rationale: prevents peeking
at what others hold, while keeping the mob's progress visible.

### III. Simplicity (YAGNI)
No accounts, no admin UI, no external services beyond Firestore. Identity is a name plus a browser-held
token. Add complexity only when a requirement demands it and the reason is recorded in the plan.

### IV. Test the Rules
Game rules (card generation, free center, win detection, rarity mix) and privacy guarantees
MUST have automated tests. Tests for these MUST pass before a feature is considered done.

### V. Strict Typing & Input Validation
All code is TypeScript in strict mode. All user input (mob names, player names, requests)
MUST be validated and length-limited server-side and rendered escaped.

## Technology Constraints

- Next.js (App Router) with TypeScript, deployed to Cloud Run (scale-to-zero) from GitHub Actions.
- Persistence behind a `Store` interface: Firestore in production, in-memory for dev/tests. No
  state may live only in instance memory in production (instances are ephemeral).
- Real-time updates via short client polling of a single document (keeps Firestore reads in the free tier).
- Cost MUST stay at free-tier levels for small usage.
- The bingo square catalog (common and rare AI-DLC behaviours) lives in a single data file
  so that content can be edited without touching game logic.

## Development Workflow

- Work follows Spec Kit: specify → plan → tasks → implement, with artifacts in `specs/`.
- Changes MUST pass lint, type-check, and tests before merge.

## Governance

This constitution supersedes other practices. Amendments require a documented change to this
file with a version bump (MAJOR: principle removal/redefinition; MINOR: new principle or
material expansion; PATCH: clarifications). Plans MUST include a Constitution Check against
these principles, and reviews MUST verify compliance.

**Version**: 1.2.0 | **Ratified**: 2026-11-18 | **Last Amended**: 2026-11-18
