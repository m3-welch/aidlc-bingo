# Feature: Low-cost serverless deployment

**Branch**: `002-cloud-run-deploy` | **Created**: 2026-11-18

## Requirements
- **FR-001**: The app MUST run on scale-to-zero serverless hosting (Cloud Run) at ~$0 for small usage.
- **FR-002**: State MUST persist across instances and restarts (Firestore).
- **FR-003**: Other players' progress MUST update without reload (polling every ~4s, paused when tab hidden).
- **FR-004**: Pushing to `main` MUST deploy automatically via GitHub Actions with keyless (OIDC) auth.
- **FR-005**: Local development and tests MUST work with no cloud dependencies.

## Success Criteria
- **SC-001**: Idle cost is $0; setup is documented in `docs/DEPLOY.md`.
- **SC-002**: Behaviour from spec 001 (privacy, BINGO, names) is unchanged.

## Decisions
GitHub Pages rejected (static only). Cloud Functions rejected in favour of Cloud Run (runs the Next.js app unchanged).
Firestore layout: one mob doc holds a `members` map of public summaries (1 read per poll); private cards live in `players/{sha256(token)}` docs.
