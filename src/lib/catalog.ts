export type Rarity = "common" | "rare";
export interface Square {
  id: string;
  text: string;
  rarity: Rarity;
}

const common = [
  "Follow-up questions are asked",
  "AI summarises the request back to you",
  "A plan is proposed before any code",
  "Requirements are broken into user stories",
  "AI asks for clarification on scope",
  "Someone says \"let's go with the recommended option\"",
  "AI creates a markdown document",
  "An inception phase is started",
  "Stage approval is requested",
  "Someone answers questions in a file",
  "AI lists assumptions",
  "A checklist item gets ticked off",
  "AI proposes multiple options",
  "Someone asks AI to \"continue\"",
  "Workspace detection runs first",
  "Units of work are defined",
  "AI references the audit log",
  "A requirements doc is generated",
  "Someone requests changes to the plan",
  "AI asks a multiple-choice question",
  "An answer is just \"A\"",
  "AI says \"Great question\"",
  "Someone reads the plan out loud to the mob",
  "A question gets answered with \"X) Other\"",
  "AI generates a user story with acceptance criteria",
  "Application design is discussed",
  "AI mentions extension opt-in",
  "Construction phase begins",
  "AI explains what it is about to do",
  "Someone says \"approve & continue\"",
  "AI updates the state file",
  "A tasks list is created",
  "Someone asks AI to explain its reasoning",
  "Code generation is paused for approval",
  "AI asks about non-functional requirements",
  "Someone mutes themselves while AI thinks",
  "Mob debates a requirement for over 5 minutes",
  "AI produces a long list of questions",
  "Someone copy-pastes an answer into a question file",
  "A decision is deferred to later",
];

const rare = [
  "AI skips a step",
  "AI ignores an instruction",
  "AI asks zero follow-up questions",
  "AI generates the wrong file name",
  "A stage is completed in under a minute",
  "AI contradicts its earlier plan",
  "Mob rejects the whole plan",
  "AI invents a requirement nobody asked for",
  "Someone restarts the workflow from scratch",
  "AI apologises twice in a row",
  "Entire mob agrees instantly",
  "AI hits a tool error and recovers on its own",
];

const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const CATALOG: Square[] = [
  ...common.map((text): Square => ({ id: `c-${slug(text)}`, text, rarity: "common" })),
  ...rare.map((text): Square => ({ id: `r-${slug(text)}`, text, rarity: "rare" })),
];

export const catalogById = new Map(CATALOG.map((s) => [s.id, s]));

export function rarePositions(squares: string[]): boolean[] {
  return squares.map((id) => catalogById.get(id)?.rarity === "rare");
}
