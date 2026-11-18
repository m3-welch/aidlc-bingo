import { handle } from "@/lib/http";
import { getMob } from "@/lib/mobs";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export const GET = async (_req: Request, { params }: Ctx) => {
  const { id } = await params;
  return handle(() => getMob(id));
};
