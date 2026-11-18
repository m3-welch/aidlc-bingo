import { handle, readJson } from "@/lib/http";
import { joinMob } from "@/lib/mobs";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export const POST = async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const body = await readJson(req);
  return handle(() => joinMob(id, body.name), 201);
};
