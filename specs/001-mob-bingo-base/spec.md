# Feature Specification: Mob Bingo Base

**Feature Branch**: `001-mob-bingo-base`

**Created**: 2026-11-18

**Status**: Draft

**Input**: User description: "A website where users create named 'Mobs' (rooms). Inside a mob, each user (who chooses a name) gets a bingo card populated with things AI-DLC does, a mix of rare and common. Mobs are not listed; sharing a link lets others join."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create a Mob and get a share link (Priority: P1)

A user opens the site, enters a name for a new mob, and receives a unique link to share.

**Why this priority**: Without mobs nothing else exists.

**Independent Test**: Create a mob with a name; confirm a unique link is shown and opening it shows the mob name.

**Acceptance Scenarios**:

1. **Given** the home page, **When** the user submits a valid mob name, **Then** a mob is created and the user is taken to its page with a copyable share link.
2. **Given** an empty or over-long name, **When** submitted, **Then** a clear validation message is shown and no mob is created.
3. **Given** the home page, **Then** no list of existing mobs is displayed anywhere.

---

### User Story 2 - Join a Mob and receive a bingo card (Priority: P1)

A user opens a share link, chooses a display name, and is assigned a 5x5 bingo card of AI-DLC behaviours.

**Why this priority**: The card is the core product.

**Independent Test**: Open a mob link in a fresh browser, enter a name, and see a 25-square card with a free center.

**Acceptance Scenarios**:

1. **Given** a valid mob link, **When** the user enters a name, **Then** they get a card of 24 distinct squares plus a free center, mixing common and rare squares.
2. **Given** a player who already joined, **When** they revisit the link in the same browser, **Then** they see the same card and marks without re-joining.
3. **Given** an invalid or unknown link, **When** opened, **Then** a "mob not found" page is shown.
4. **Given** a name already used in the mob, **When** a new player submits it, **Then** they are asked to choose another.

---

### User Story 3 - Play: mark squares and call BINGO (Priority: P1)

A player taps squares as the matching AI-DLC behaviour occurs. A row, column, or diagonal of five marked squares (free center counts) is BINGO.

**Why this priority**: Makes the card playable.

**Independent Test**: Mark five squares in a line and see BINGO indicated; unmark and see it cleared.

**Acceptance Scenarios**:

1. **Given** a card, **When** the player taps a square, **Then** it toggles marked and persists across reloads.
2. **Given** five in a line, **Then** the card shows BINGO and the winning line is highlighted.
3. **Given** rare squares, **Then** they are visually distinguishable from common squares.

---

### User Story 4 - See mob progress without seeing others' cards (Priority: P2)

Players see a live list of mob members showing each member's marked count, BINGO status, and a mini grid of which squares they have marked, but never the square text.

**Why this priority**: Adds the social element, but the game works without it.

**Independent Test**: Two browsers join one mob; marking in one updates the other's member list within seconds, with the marked positions shown but no square text exposed.

**Acceptance Scenarios**:

1. **Given** two players, **When** one marks a square, **Then** the other sees that player's count update live without reload.
2. **Given** a player gets BINGO, **Then** all members see a BINGO indicator for them.
3. **Given** any request by another player, **Then** card contents are never returned.

---

### Edge Cases

- Two people with the same name joining simultaneously: only one succeeds.
- Player clears browser storage: they cannot reclaim the card and must join under a new name.
- Mob link with altered characters: "not found", with no hint of other mobs.
- Large mobs: member list stays usable (assumed up to 50 players).
- Catalog smaller than 24 squares: not allowed; the catalog MUST contain enough squares.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Users MUST be able to create a mob by providing a name (1–50 characters, trimmed).
- **FR-002**: Each mob MUST have a unique, unguessable share link.
- **FR-003**: The system MUST NOT list, search, or enumerate mobs.
- **FR-004**: Users MUST be able to join a mob via its link by choosing a player name (1–30 characters, unique within the mob, case-insensitive).
- **FR-005**: On joining, a player MUST be assigned a 5x5 card with a free center and 24 distinct squares randomly drawn from the AI-DLC catalog, always including both common and rare squares.
- **FR-006**: The catalog MUST contain common squares (e.g., "Follow-up questions are asked") and rare squares (e.g., "A step is skipped"), editable in one data file.
- **FR-007**: Rare squares MUST be visually distinguishable from common ones.
- **FR-008**: Players MUST be able to mark and unmark squares; state MUST persist.
- **FR-009**: The system MUST detect BINGO (any full row, column, or diagonal, free center counted) and display it.
- **FR-010**: A returning player in the same browser MUST be recognised without re-entering their name.
- **FR-011**: Players MUST see all members' names, marked counts, BINGO status, and which grid positions are marked, updated live.
- **FR-012**: The system MUST NOT reveal any player's square text or rarity to others; only marked positions are shared.
- **FR-013**: All user-provided text MUST be validated and rendered safely.
- **FR-014**: The site MUST be usable on mobile and desktop screens.

### Key Entities

- **Mob**: Named room with an unguessable identifier and creation time.
- **Player**: Name, belongs to one mob, holds a private token known only to their browser.
- **Square**: Catalog entry with text and rarity (common or rare).
- **Card**: A player's 5x5 grid of squares (center free) with per-cell marked state.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can create a mob and copy its link in under 30 seconds.
- **SC-002**: A user opening a link can have a card in under 20 seconds.
- **SC-003**: Marking a square is reflected in other players' member lists within 3 seconds.
- **SC-004**: Zero cases in testing where one player can obtain another's card contents.
- **SC-005**: Every generated card has 24 distinct squares and contains at least one rare square.
- **SC-006**: Mob and card state survive a page reload 100% of the time.

## Assumptions

- No accounts; identity is a name plus a browser-held token.
- Mobs have no expiry or deletion in this base version.
- Mobs have no host/admin role; all members are equal.
- Cards are fixed once assigned (no re-roll).
- English only; catalog content is an initial seed list.
