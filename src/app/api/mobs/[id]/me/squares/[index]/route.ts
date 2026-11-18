import { bearer } from "@/lib/auth";
import { handle, readJson } from "@/lib/http";
import { setMark } from "@/lib/mobs";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string; index: string }> };

export const PUT = async (req: Request, { params }: Ctx) => {
  const { id, index } = await params;
  const body = await readJson(req);
  return handle(() => setMark(id, bearer(req), /^\d+$/.test(index) ? Number(index) : NaN, body.marked));
};
