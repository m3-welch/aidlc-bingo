import { handle, readJson } from "@/lib/http";
import { createMob } from "@/lib/mobs";

export const dynamic = "force-dynamic";

export const POST = (req: Request) =>
  readJson(req).then((body) => handle(() => createMob(body.name), 201));
